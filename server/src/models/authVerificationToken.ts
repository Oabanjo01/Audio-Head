import { compare, genSalt, hash } from "bcrypt";
import { model, Schema } from "mongoose";

const authVerificationSchema = new Schema(
  {
    owner: {
      type: Schema.ObjectId,
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
    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
    next();
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
