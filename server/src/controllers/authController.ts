import crypto from "crypto";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import path from "path";
import cloud from "src/cloudinary/config";

import AuthVerificationModel from "../models/authVerificationToken";
import PasswordVerificationModel from "../models/passwordVerificationToken";
import UserModel from "../models/user";
import {
  CreateUserRequestBody,
  GenerateNewRefreshTokenRequestBody,
  PasswordResetRequestBody,
  PasswordResetTokenRequestBody,
  SignInUserRequestBody,
  UpdateProfileRequestBody,
  VerifyUserRequestBody,
} from "../types/authTypes";
import mail from "../utilities/mail/sendMail";
import { sendResponse } from "../utilities/sendRequest";
import { storedValues } from "../variables";

const rootPath = path.resolve(__dirname, "../");

const createaNewUser: RequestHandler<{}, {}, CreateUserRequestBody> = async (
  req,
  res,
  next
) => {
  const { email, name, password } = req.body;

  if (!email) return sendResponse(res, 422, "E-Mail is not valid");
  if (!name) return sendResponse(res, 422, "Name is not valid");
  if (!password) return sendResponse(res, 422, "Password is not incorrect");

  const userExists = await UserModel.findOne({
    email,
  });
  if (userExists) {
    sendResponse(res, 401, "User already exists");
  } else {
    const user = await UserModel.create({
      email,
      name,
      password,
    });

    // generating a new token
    const token = crypto.randomBytes(36).toString("hex");

    await AuthVerificationModel.create({
      owner: user._id,
      token: token,
    });

    const link = `${storedValues.verificationLink}?id=${user._id}&token=${token}`;
    const emailTemplatePath = path.join(
      rootPath,
      "/views/verificationLink.ejs"
    );

    await mail
      .sendMail(emailTemplatePath, user.email, link)
      .then(() => {
        console.log("Mail sent");
        res
          .status(200)
          .json({ message: "Check your email for a verification link" });
      })
      .catch((err) => {
        res.json({ message: "An error occured sending you an email" });
        console.log(err, "===err");
      });
  }
};

const verifyUser: RequestHandler<{}, {}, VerifyUserRequestBody> = async (
  req,
  res
) => {
  const { owner, token } = req.body;
  const tokenIdExists = await AuthVerificationModel.findOne({
    owner: owner,
  });
  const isVerified = await UserModel.findById(owner);

  if (!tokenIdExists) {
    if (isVerified?.verified === true)
      return sendResponse(res, 412, "Your email has already been verified");
    sendResponse(res, 403, "Could not validate your email address");
  } else {
    const tokenMatches = tokenIdExists.validateToken(token);
    if (!tokenMatches) {
      return sendResponse(res, 403, "Invalid token");
    } else {
      await UserModel.findByIdAndUpdate(owner, {
        verified: true,
      });
      await AuthVerificationModel.findByIdAndDelete(tokenIdExists._id);
      return res.json({ message: "Verified successfully" });
    }
  }
};

const signUserIn: RequestHandler<{}, {}, SignInUserRequestBody> = async (
  req,
  res
) => {
  const { email, password } = req.body;
  console.log("got here");
  if (!email) sendResponse(res, 422, "E-Mail is not valid");
  if (!password) sendResponse(res, 422, "Password is not incorrect");

  const user = await UserModel.findOne({
    email: email,
  });

  const passwordIsValid = await user?.validatePassword(password);
  if (!user) {
    sendResponse(res, 403, "Email address not found");
  } else if (!passwordIsValid) {
    sendResponse(res, 403, "This password is incorrect");
  } else {
    // signing the user ID with jwt
    const payload = {
      id: user._id,
    };

    const accessToken = jwt.sign(payload, storedValues.secretkey, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, storedValues.secretkey);

    if (!user.tokens) {
      user.tokens = [refreshToken];
    } else {
      user.tokens.push(refreshToken);
    }

    await user.save();
    res.json({
      userData: {
        email: user.email,
        id: user._id,
        name: user.name,
        verified: user.verified,
      },
      tokens: {
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
      message: "Logged in successfully",
    });
  }
};

const regenerateVerificationLink: RequestHandler = async (req, res) => {
  const { id, email } = req.user;

  await AuthVerificationModel.findOneAndDelete({ owner: id });

  const emailTemplatePath = path.join(rootPath, "/views/verificationLink.ejs");
  const token = crypto.randomBytes(36).toString("hex");
  const link = `${storedValues.verificationLink}?id=${id}&token=${token}`;

  await AuthVerificationModel.create({
    owner: id,
    token: token,
  });

  await mail.sendMail(emailTemplatePath, email, link).then(() => {
    res.json({
      message: "Kindly re-verify your email using this verification link",
    });
  });
};

const sendProfile: RequestHandler = (req, res) => {
  return res.json({
    profile: req.user,
    message: "Fetched profile successfully",
  });
};

const generateNewRefreshToken: RequestHandler<
  {},
  {},
  GenerateNewRefreshTokenRequestBody
> = async (req, res) => {
  const { refreshToken } = req.body;

  const tokenExists = await UserModel.findOne({
    tokens: refreshToken,
  });
  if (!tokenExists) {
    sendResponse(res, 404, "Unauthorized request!");
  } else {
    const decodedPayload = jwt.verify(refreshToken, storedValues.secretkey) as {
      id: string;
    };

    const user = await UserModel.findOne({ _id: decodedPayload.id });

    if (!user) {
      await UserModel.findByIdAndUpdate({ _id: decodedPayload.id, tokens: [] });
      sendResponse(res, 401, "Unauthorized request");
    } else {
      // this user exists and I want to update with a new generated refresh token

      const payload = {
        id: user._id,
      };

      const accessToken = jwt.sign(payload, storedValues.secretkey, {
        expiresIn: "15m",
      });
      const newRefreshToken = jwt.sign(payload, storedValues.secretkey);

      // filter token without the previous refresh token
      const filteredTokens = user.tokens.filter(
        (prevToken) => prevToken !== refreshToken
      );

      user.tokens = filteredTokens;
      user.tokens.push(newRefreshToken);

      await user.save();

      res.json({
        userData: {
          email: user.email,
          id: user._id,
          name: user.name,
          verified: user.verified,
        },
        tokens: {
          refreshToken: newRefreshToken,
          accessToken: accessToken,
        },
      });
    }
  }
};

const signOut: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;

  const userExists = await UserModel.findOne({
    _id: req.user.id,
  });

  if (!userExists) {
    return sendResponse(res, 401, "Your request could not be processed");
  }
  const newTokenList = userExists.tokens.filter(
    (token) => token !== refreshToken
  );

  userExists.tokens = newTokenList;
  userExists.save();

  res.json({
    message: "You have been signed out successfully",
  });
};

const generatePasswordResetLink: RequestHandler<
  {},
  {},
  PasswordResetTokenRequestBody
> = async (req, res) => {
  const { email } = req.body;
  const userExists = await UserModel.findOne({
    email: email,
  });

  if (!userExists) {
    sendResponse(res, 404, "This user does not exist");
  } else {
    // checking if this token has been created already, then delete it
    await PasswordVerificationModel.findOneAndDelete({
      owner: userExists._id,
    });

    // generating a new token
    const token = crypto.randomBytes(36).toString("hex");
    await PasswordVerificationModel.create({
      owner: userExists._id,
      token: token,
    });

    const link = `${storedValues.passwordVerificationLink}?id=${userExists._id}&token=${token}`;
    const emailTemplatePath = path.join(
      rootPath,
      "/views/passwordVerificationLink.ejs"
    );

    await mail
      .sendResetPasswordMail(link, userExists.email, emailTemplatePath)
      .then(() => {
        res.json({
          message: "A password reset link has been sent to your email address",
        });
      });
  }
};

const validGoThrough: RequestHandler = (req, res) => {
  res.json({ message: "Password token is valid" });
};

const resetPassword: RequestHandler<{}, {}, PasswordResetRequestBody> = async (
  req,
  res
) => {
  const { owner, newPassword } = req.body;

  console.log(newPassword, "newPassword");
  const userExists = await UserModel.findById(owner);

  if (!userExists) return sendResponse(res, 404, "User not found");

  const matchesCurrent = await userExists.validatePassword(newPassword);

  if (matchesCurrent)
    return sendResponse(
      res,
      401,
      "This Password exists already, use a new one"
    );

  userExists.password = newPassword;

  await PasswordVerificationModel.findOneAndDelete({
    owner: owner,
  });

  const emailTemplatePath = path.join(
    rootPath,
    "/views/successPasswordReset.ejs"
  );

  userExists.save();

  await mail
    .sendPasswordSuccesResetMail(emailTemplatePath, userExists.email)
    .then(() => {
      res.json({ message: "Your Password has been reset." });
    });
};

const updateProfile: RequestHandler<{}, {}, UpdateProfileRequestBody> = async (
  req,
  res
) => {
  /**
User must be logged in (authenticated) - done
Name must be valid - done
Find user and update the name.
Send new profile back.
  **/

  const { name } = req.body;
  const { id } = req.user;

  if (!name) return sendResponse(res, 401, "Username is not provided.");

  const userExists = await UserModel.findById(id);
  console.log(userExists?.name, name, "userExists, id");

  if (userExists?.name === name)
    return sendResponse(res, 401, "This name already exists.");

  if (!userExists) return sendResponse(res, 404, "Unauthorized request.");

  await UserModel.findByIdAndUpdate(id, {
    name: name,
  });

  res.json({
    userData: {
      email: userExists.email,
      verified: userExists.verified,
      ...req.body,
    },
  });
};

const uploadAnAvatar: RequestHandler = async (req, res) => {
  const { filename } = req.files;

  console.log(Array.isArray(filename), "filename");

  if (!filename) return sendResponse(res, 422, "Not a valid avatar");
  if (Array.isArray(filename))
    return sendResponse(res, 422, "Cannot have more than one avatar");

  if (!filename.mimetype?.startsWith("image"))
    return sendResponse(res, 422, "A file of image type must be selected");

  const userExists = await UserModel.findById(req.user.id);

  if (!userExists) return sendResponse(res, 404, "User does not exist");

  if (userExists.avatar?.id) {
    await cloud.destroy(userExists.avatar.id);
  }
  const { secure_url: url, public_id: id } = await cloud.upload(
    filename.filepath,
    {
      transformation: {
        width: 300,
        height: 300,
        crop: "thumb",
        background: "transparent",
        gravity: "face",
      },
    }
  );

  userExists.avatar = {
    id: id,
    url: url,
  };

  userExists.save();

  res.json({
    userData: {
      ...req.user,
      avatar: url,
    },
  });
};

const getUserPublicProfile: RequestHandler = async (req, res) => {
  const public_id = req.params.id;

  if (!isValidObjectId(public_id))
    return sendResponse(res, 422, "Unauthorized request");

  const userExixts = await UserModel.findById(public_id);

  if (!userExixts) return sendResponse(res, 404, "User not found");

  res.json({
    userPublicData: {
      avatar: userExixts.avatar?.url,
      name: userExixts.name,
      email: userExixts.email,
    },
  });
};

export {
  createaNewUser,
  generateNewRefreshToken,
  generatePasswordResetLink,
  getUserPublicProfile,
  regenerateVerificationLink,
  resetPassword,
  sendProfile,
  signOut,
  signUserIn,
  updateProfile,
  uploadAnAvatar,
  validGoThrough,
  verifyUser,
};
