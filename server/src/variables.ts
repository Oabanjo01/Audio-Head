import "dotenv/config";

const verificationLink = process.env.VERIFICATION_LINK;
const passwordVerificationLink = process.env.PASSWORD_VERIFICATION_LINK;
const secretkey = process.env.JWT_SECRET_LINK!;
const mailTrapUser = process.env.MAILTRAP_USER;
const mailTrapPassword = process.env.MAILTRAP_PASSWORD!;
const cloudName = process.env.CLOUD_NAME;
const cloudKey = process.env.CLOUD_KEY;
const cloudSecret = process.env.CLOUD_SECRET;

export const storedValues = {
  verificationLink,
  secretkey,
  mailTrapPassword,
  mailTrapUser,
  passwordVerificationLink,
  cloudName,
  cloudKey,
  cloudSecret,
};
