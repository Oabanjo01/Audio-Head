import crypto from "crypto";
import { RequestHandler } from "express";
import nodemailer from "nodemailer";

import AuthVerificationModel from "./models/authVerificationToken";
import UserModel from "./models/user";
import { sendResponse } from "./utilities/sendRequest";

const createaNewUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    if (!email) sendResponse(res, 422, "E-Mail is not valid");
    if (!name) sendResponse(res, 422, "Name is not valid");
    if (!password) sendResponse(res, 422, "Password is not incorrect");

    const userExists = await UserModel.findOne({
      email,
    });
    if (userExists) {
      console.log("User already exists");

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
  } catch (error: unknown) {
    // next(error);
    throw error;
  }
};

export { createaNewUser };
