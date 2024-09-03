import ejs from "ejs";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5c3ae3ab638a60",
    pass: "71daf6c2929239",
  },
});
const sendMail = async (
  link: string,
  email: string,
  emailTemplatePath: string
) => {
  const htmlContent = await ejs.renderFile(emailTemplatePath, {
    title: "Verify your email",
    message: "Click this link to verify your email",
    verificationLink: link,
  });

  console.log(htmlContent, "html content");

  await transport.sendMail({
    subject: "Verify your email",
    from: "banjola@gmail.com",
    to: email,
    html: htmlContent,
  });
};

const mail = {
  sendMail,
};

export default mail;
