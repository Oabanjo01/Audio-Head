import { Schema } from "mongoose";

export interface CreateUserRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface VerifyUserRequestBody {
  token: string;
  owner: Schema.Types.ObjectId;
}

export interface SignInUserRequestBody {
  email: string;
  password: string;
}
export interface GenerateNewRefreshTokenRequestBody {
  refreshToken: string;
}
export interface PasswordResetTokenRequestBody {
  email: string;
}
