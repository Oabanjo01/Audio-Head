import crypto from "crypto";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import AuthVerificationModel from "./models/authVerificationToken";
import UserModel from "./models/user";
import {
  CreateUserRequestBody,
  SignInUserRequestBody,
  VerifyUserRequestBody,
} from "./types/authTypes";
import { sendResponse } from "./utilities/sendRequest";

const createaNewUser: RequestHandler<{}, {}, CreateUserRequestBody> = async (
  req,
  res,
  next
) => {
  const { email, name, password } = req.body;

  if (!email) sendResponse(res, 422, "E-Mail is not valid");
  if (!name) sendResponse(res, 422, "Name is not valid");
  if (!password) sendResponse(res, 422, "Password is not incorrect");

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

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "5c3ae3ab638a60",
        pass: "71daf6c2929239",
      },
    });

    await transport
      .sendMail({
        subject: "Verify Testing Works",
        from: "banjola@gmail.com",
        to: user.email,
        html: `<h1>Click this <a href={"${link}"}>link</a>  to verify your email</h1>`,
      })
      .then(() => {
        res.json({ message: "Verify Testing Works" });
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

  if (!tokenIdExists) {
    sendResponse(res, 403, "Token not found");
  } else {
    const tokenMatches = tokenIdExists.validateToken(token);
    if (!tokenMatches) {
      sendResponse(res, 403, "Invalid token");
    } else {
      await UserModel.findByIdAndUpdate(owner, {
        verified: true,
      });
      await AuthVerificationModel.findByIdAndDelete(tokenIdExists._id);

      res.json({ message: "Your account has been verified." });
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
    // const tokenAlreadyExists = await AuthVerificationModel.findOne({
    //   owner: emailExists._id,
    // });

    // // generating a new token
    // const token = crypto.randomBytes(36).toString("hex");
    // console.log(tokenAlreadyExists);

    // if (tokenAlreadyExists) {
    //   console.log("got here", emailExists._id);
    //   await AuthVerificationModel.findByIdAndUpdate(emailExists._id, {
    //     token: token,
    //   });
    // } else {
    //   await AuthVerificationModel.create({
    //     token: token,
    //   });
    // }

    // res.json({ message: "Sign in successful." });
  }
};

export { createaNewUser, signUserIn, verifyUser };
