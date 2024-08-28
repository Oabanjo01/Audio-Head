import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).send({ message: message });
};
