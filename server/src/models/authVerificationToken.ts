import { compare, genSalt, hash } from "bcrypt";
import { model, Schema } from "mongoose";

interface AuthVerificationSchemaDocument extends Document {
  owner: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

interface Method {
  validateToken(token: string): Promise<boolean>;
}

const authVerificationSchema = new Schema<
  AuthVerificationSchemaDocument,
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
      expires: 86400,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

authVerificationSchema.pre("save", async function (next) {
  if (this.isModified("token") === true) {
    console.log("token was not modified");
    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
    next();
  } else {
    console.log("token was  modified");
  }
});

authVerificationSchema.methods.validateToken = async function (
  inputtedToken: string
) {
  return await compare(inputtedToken, this.token);
};

const AuthVerificationModel = model(
  "AuthVerificationToken",
  authVerificationSchema
);
export default AuthVerificationModel;
