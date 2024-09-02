import { RequestHandler } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import UserModel from "src/models/user";
import { sendResponse } from "src/utilities/sendRequest";

interface UserProfileType {
  email: string;
  id: any;
  name: string;
  verified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user: UserProfileType;
    }
  }
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    console.log(authToken, "authToken");

    if (!authToken) {
      return sendResponse(res, 403, "Unauthorized request");
    }

    const token = authToken.split("Bearer ")[1];
    console.log(token, "token - got here");

    const decodedPayload = jwt.verify(token, "secretkey") as { id: string };
    console.log(decodedPayload, "user");

    const user = await UserModel.findById(decodedPayload.id);
    console.log(user, "user");

    if (!user) {
      return sendResponse(res, 403, "Unauthorized request");
    }

    req.user = {
      email: user.email,
      id: user._id,
      name: user.name,
      verified: user.verified,
    };

    next();
  } catch (error) {
    console.log(error);
    if (error instanceof TokenExpiredError) {
      return sendResponse(res, 401, "Session expired");
    } else if (error instanceof JsonWebTokenError) {
      return sendResponse(res, 401, "Unauthorized access");
    }
    next(error);
  }
};
