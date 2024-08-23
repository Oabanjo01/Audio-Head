import "src/db/index";

import express from "express";
import authRouter from "routes/auth";

const app = express();

// simulating a middleware for passing a parsed req.body
// const bodyParser: RequestHandler = (req, res, next) => {
//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk);
//     next();
//   });
// };

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// API routes
app.use("/auth", authRouter);

app.listen(8000, () => {
  console.log("The app is listening");
});
