import { compare, genSalt, hash } from "bcrypt";
import { Document, model, Schema } from "mongoose";

interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  verified: Boolean;
  tokens: string[];
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
