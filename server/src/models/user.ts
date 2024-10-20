import { compare, genSalt, hash } from "bcrypt";
import { Document, model, Schema } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  verified: boolean;
  tokens: string[];
  avatar?: { url: string; id: string };
}

interface Method {
  validatePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Method>(
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
    verified: {
      type: Boolean,
      default: false,
    },
    tokens: {
      type: [String],
    },
    avatar: {
      type: Object,
      url: String,
      id: String,
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
    console.log(this.password);
    next();
  } else {
    // console.log(this.password, "was not rest");
  }
});

userSchema.methods.validatePassword = function (inputtedPassword: string) {
  const isValid = compare(inputtedPassword, this.password);
  return isValid;
};

const UserModel = model("User", userSchema);

export default UserModel;
