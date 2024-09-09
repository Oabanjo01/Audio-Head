import ejs from "ejs";
import nodemailer from "nodemailer";
import { storedValues } from "src/variables";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: storedValues.mailTrapUser,
    pass: storedValues.mailTrapPassword,
  },
});

const sendMail = async (emailTemplatePath: string, email: any, link: any) => {
  const htmlContent = await ejs.renderFile(emailTemplatePath, {
    title: "Verify your email",
    message: "Click this link to verify your email",
    verificationLink: link,
  });

  await transport.sendMail({
    subject: "Verify your email",
    from: "banjolakunri@gmail.com",
    to: email,
    html: htmlContent,
  });
};

const sendPasswordSuccesResetMail = async (
  emailTemplatePath: string,
  email: any
) => {
  const htmlContent = await ejs.renderFile(emailTemplatePath, {
    title: "Your password has been reset.",
    message: "You can now login with your new password, yay!",
  });

  await transport.sendMail({
    subject: "Passwrod has been reset",
    from: "banjolakunri@gmail.com",
    to: email,
    html: htmlContent,
  });
};

const sendResetPasswordMail = async (
  link: string,
  email: string,
  emailTemplatePath: string
) => {
  const htmlContent = await ejs.renderFile(emailTemplatePath, {
    title: "Reset your password",
    message: "Click this link to reset your password",
    verificationLink: link,
  });

  await transport.sendMail({
    subject: "Reset Password",
    from: "security-reset@gmail.com",
    to: email,
    html: htmlContent,
  });
};

const mail = {
  sendMail,
  sendResetPasswordMail,
  sendPasswordSuccesResetMail,
};

export default mail;
