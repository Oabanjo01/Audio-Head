import express from "express";

import authRouter, { a, b, c } from "routes/auth";
const app = express();

// simulating a middleware for passing a parsed req.body
// const bodyParser: RequestHandler = (req, res, next) => {
//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk);
//     next();
//   });
// };

const sum = a + b + c;

console.log(sum);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// API routes
app.use(authRouter);

app.listen(8000, () => {
  console.log("The app is listening");
});
