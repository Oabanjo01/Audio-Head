import "dotenv/config";

const verificationLink = process.env.VERIFICATION_LINK;
const passwordVerificationLink = process.env.PASSWORD_VERIFICATION_LINK;
const secretkey = process.env.JWT_SECRET_LINK!;
const mailTrapUser = process.env.MAILTRAP_USER;
const mailTrapPassword = process.env.MAILTRAP_PASSWORD!;

export const storedValues = {
  verificationLink,
  secretkey,
  mailTrapPassword,
  mailTrapUser,
  passwordVerificationLink,
};
