import "dotenv/config";
import "express-async-errors";
import "src/db/index";

import express, { ErrorRequestHandler } from "express";
import path from "path";
import authRouter from "routes/auth";

const app = express();

// simulating a middleware for passing a parsed req.body
// const bodyParser: RequestHandler = (req, res, next) => {
//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk);
//     next();
//   });
// };

// to look up the views folder
app.set("views", path.join(__dirname, "views"));
// registering view engine
app.set("view engine", "ejs");
app.use(express.static("src/views"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// API routes
app.use("/auth", authRouter);

app.get("/verify", (req, res, next) => {
  res.render("verifyingEmail", {
    title: "Account Verification",
    message: "Please wait, we are verifying your account.",
    description: "This may take a few moment, please don't close this page.",
  });
  next();
});

app.get("/password-verification", (req, res, next) => {
  console.log(req.body);
  res.render("resettingpassword", {
    title: "Reset Password",
    message: "Please wait, this might take a minute.",
    description: "This may take a few moment, please don't close this page.",
  });
  next();
});

// catch error after failed dealings in the auth router
app.use(function (err, req, res, next) {
  res.status(500).json({ message: err.message });
} as ErrorRequestHandler);

app.listen(8000, () => {
  console.log("The app is listening");
});
