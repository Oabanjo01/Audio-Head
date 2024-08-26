import { RequestHandler } from "express";
const crypto = require("crypto");

import AuthVerificationModel from "./models/authVerificationToken";
import UserModel from "./models/user";

const createaNewUser: RequestHandler = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email) res.status(422).send({ message: "E-Mail is not valid" });
  if (!name) res.status(422).send({ message: "Name is not valid" });
  if (!password) res.status(422).send({ message: "Password is not incorrect" });

  const userExists = await UserModel.findOne({
    email,
  });
  if (userExists) {
    console.log("User already exists");
    return res.status(401).send({
      message: "User already exists",
    });
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
    console.log("got here in controller");
    const link = `http://localhost:8000/verify?id=${user._id}&token=${token}`;
    res.status(200).send(link);
  }
};

export { createaNewUser };
