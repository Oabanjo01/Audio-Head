import { compare, genSalt, hash } from "bcrypt";
import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") === true) {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  }
});

userSchema.methods.validatePassword = function (inputtedPassword: string) {
  const isValid = compare(inputtedPassword, this.password);
  return isValid;
};

const UserModel = model("User", userSchema);

export default UserModel;
