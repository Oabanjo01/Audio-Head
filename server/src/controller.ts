import crypto from "crypto";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import path from "path";

import AuthVerificationModel from "./models/authVerificationToken";
import UserModel from "./models/user";
import {
  CreateUserRequestBody,
  GenerateNewRefreshTokenRequestBody,
  SignInUserRequestBody,
  VerifyUserRequestBody,
} from "./types/authTypes";
import mail from "./utilities/mail/sendMail";
import { sendResponse } from "./utilities/sendRequest";

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
    return sendResponse(res, 401, "User already exists");
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

    const link = `http://localhost:8000/verify?id=${user._id}&token=${token}`;
    const emailTemplatePath = path.join(
      __dirname,
      "/views/verificationLink.ejs"
    );

    await mail.sendMail(link, user.email, emailTemplatePath).then(() => {
      res.json({ message: "Verify your email" });
    });
  }
};

const verifyUser: RequestHandler<{}, {}, VerifyUserRequestBody> = async (
  req,
  res
) => {
  console.log("Got here while verifying your email");
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

    const accessToken = jwt.sign(payload, "secretkey", {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, "secretkey");

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
    });
  }
};

const regenerateVerificationLink: RequestHandler = async (req, res) => {
  const { id, email } = req.user;

  await AuthVerificationModel.findOneAndDelete({ owner: id });

  const emailTemplatePath = path.join(__dirname, "/views/verificationLink.ejs");
  const token = crypto.randomBytes(36).toString("hex");
  const link = `http://localhost:8000/verify?id=${id}&token=${token}`;

  await AuthVerificationModel.create({
    owner: id,
    token: token,
  });

  await mail.sendMail(link, email, emailTemplatePath).then(() => {
    res.json({
      message: "Kindly re-verify your email using this verification link",
    });
  });
};

const sendProfile: RequestHandler = (req, res) => {
  return res.json({ profile: req.user });
};

const generateNewRefreshToken: RequestHandler<
  {},
  {},
  GenerateNewRefreshTokenRequestBody
> = async (req, res) => {
  const { refreshToken } = req.body;
  console.log(refreshToken, "refresh token");

  const tokenExists = await UserModel.findOne({
    tokens: refreshToken,
  });
  if (!tokenExists) {
    sendResponse(res, 404, "Unauthorized request!");
  } else {
    const decodedPayload = jwt.verify(refreshToken, "secretkey") as {
      id: string;
    };

    const user = await UserModel.findOne({ _id: decodedPayload.id });

    if (!user) {
      await UserModel.findByIdAndUpdate({ _id: decodedPayload.id, tokens: [] });
      sendResponse(res, 401, "Unauthorized request");
    } else {
      console.log("user exists", user);
      // this user exists and I want to update with a new generated refresh token

      const payload = {
        id: user._id,
      };

      const accessToken = jwt.sign(payload, "secretkey", {
        expiresIn: "15m",
      });
      const newRefreshToken = jwt.sign(payload, "secretkey");

      console.log("new refresh token generated", newRefreshToken);
      // filter token without the previous refresh token
      const filteredTokens = user.tokens.filter(
        (prevToken) => prevToken !== refreshToken
      );

      console.log("filtered tokens:", filteredTokens);
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

export {
  createaNewUser,
  generateNewRefreshToken,
  regenerateVerificationLink,
  sendProfile,
  signUserIn,
  verifyUser,
};
