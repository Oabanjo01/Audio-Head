import { RequestHandler } from "express";

const createaNewUser: RequestHandler = (req, res) => {
  const { email, name, password } = req.body;

  if (!email) res.status(422).send({ message: "E-Mail is not valid" });
  if (!name) res.status(422).send({ message: "Name is not valid" });
  if (!password) res.status(422).send({ message: "Password is not incorrect" });

  res.send("Signed In");
};

export { createaNewUser };
