import { connect } from "mongoose";

// both works
const uri =
  "mongodb+srv://chat-app:Test1234@banjos-blog.2ehwwpa.mongodb.net/Chat-App?retryWrites=true&w=majority&appName=Banjos-Blog";
// const uri =
//   "mongodb+srv://<db_username>:<db_password>@banjos-blog.2ehwwpa.mongodb.net/?retryWrites=true&w=majority&appName=Banjos-Blog";
// const uri2 = "mongodb://127.0.0.1:27017/chatApp";

connect(uri, {
  family: 4,
})
  .then(() => {
    console.log("success");
  })
  .catch((e) => {
    console.log("error:", e.message);
  });
