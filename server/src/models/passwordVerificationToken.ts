import { compare, genSalt, hash } from "bcrypt";
import { Document, model, Schema } from "mongoose";

interface PasswordVerificationSchemaDocument extends Document {
  owner: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

interface Method {
  validateToken(token: string): Promise<boolean>;
}

const passwordVerificationSchema = new Schema<
  PasswordVerificationSchemaDocument,
  {},
  Method
>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 3600,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

passwordVerificationSchema.pre("save", async function (next) {
  if (this.isModified("token") === true) {
    console.log("token was modified");
    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
    next();
  } else {
  }
});

passwordVerificationSchema.methods.validateToken = async function (
  inputtedToken: string
) {
  return await compare(inputtedToken, this.token);
};

const PasswordVerificationModel = model(
  "PasswordVerificationToken",
  passwordVerificationSchema
);
export default PasswordVerificationModel;
