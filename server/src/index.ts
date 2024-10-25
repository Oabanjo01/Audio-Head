import "dotenv/config";
import "express-async-errors";
import "src/db/index";

import express, { ErrorRequestHandler } from "express";
import path from "path";
import authRouter from "routes/auth";

import productRouter from "./routes/product";

const app = express();

// simulating a middleware for passing a parsed req.body
// const bodyParser: RequestHandler = (req, res, next) => {
//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk);
//     next();
//   });
// };

// to look up the views folder
const directoryPath = path.join(__dirname, "views");
app.set("views", directoryPath);

// registering view engine
app.set("view engine", "ejs");

// Express's built-in body-parsing middleware (express.urlencoded() and express.json()) doesn't handle multipart/form-data
app.use(express.static("src/views/"));
// app.use(express.static("src/views/uploads"));
app.use(express.json()); // For parsing application/json e.g {"name": "John", "age": 30}
app.use(
  // For parsing application/x-www-form-urlencoded e.g name=John&age=30
  express.urlencoded({
    extended: false,
  })
);

// Formidable - parse the multipart/form-data content type correctly. The below is for uploading to local directories
// console.log(path.join(__dirname, "views"));
// app.post("/upload-photo", async (req, res, next) => {
//   console.log("got upload photo", req.body);
//   const form = formidable({
//     uploadDir: path.join(__dirname, "views"),
//     filename(name, ext, part, form) {
//       console.log("name: " + name);
//       console.log("ext: " + ext);
//       console.log("part: " + part.originalFilename, part.name);
//       return Date.now() + "_" + part.originalFilename;
//     },
//   });

//   await form.parse(req);

//   res.send({ message: "ok" });
// });

// API routes
app.use("/auth", authRouter);
app.use("/product", productRouter);

app.get("/verify", (_req, res, next) => {
  res.render("verifyingEmail", {
    title: "Account Verification",
    message: "Please wait, we are verifying your account.",
    description: "This may take a few moment, please don't close this page.",
  });
  next();
});

app.get("/password-verification", (_req, res, next) => {
  res.render("resettingpassword", {
    title: "Reset Password",
    message: "Please wait, this might take a minute.",
    description: "This may take a few moment, please don't close this page.",
  });
  next();
});

// catch error after failed dealings in the auth router
app.use(function (err, _req, res, _next) {
  res.status(500).json({ message: err.message });
} as ErrorRequestHandler);

app.listen(8000, () => {
  console.log("The app is listening");
});
