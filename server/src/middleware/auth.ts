import { RequestHandler } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import PasswordVerificationModel from "src/models/passwordVerificationToken";
import UserModel from "src/models/user";
import { sendResponse } from "src/utilities/sendRequest";
import { storedValues } from "src/variables";

interface UserProfileType {
  email: string;
  id: any;
  name: string;
  verified: boolean;
  avatar?: {
    url: string;
    id: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user: UserProfileType;
    }
  }
}

export const validatePasswordToken: RequestHandler = async (req, res, next) => {
  const { owner, token } = req.body;

  try {
    const tokenExists = await PasswordVerificationModel.findOne({
      owner: owner,
    });

    if (!tokenExists) {
      return sendResponse(res, 403, "Unauthorized request");
    } else {
      const isValid = await tokenExists.validateToken(token);
      if (!isValid) {
        return sendResponse(res, 403, "Unauthorized request");
      } else {
        next();
      }
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return sendResponse(res, 401, "Session expired");
    } else if (error instanceof JsonWebTokenError) {
      return sendResponse(res, 401, "Unauthorized access");
    }
    next(error);
  }
};

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    console.log(`isAuthenticated`, authToken);
    if (!authToken) {
      return sendResponse(res, 403, "Unauthorized request");
    }

    const token = authToken.split("Bearer ")[1];

    const decodedPayload = jwt.verify(token, storedValues.secretkey) as {
      id: string;
    };

    const user = await UserModel.findById(decodedPayload.id);

    if (!user) {
      return sendResponse(res, 403, "Unauthorized request");
    }
    // why this works - Any modifications made to req in one middleware function will be available to subsequent middleware functions and route handlers.
    req.user = {
      email: user.email,
      id: user._id,
      name: user.name,
      verified: user.verified,
      avatar: user.avatar,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return sendResponse(res, 401, "Session expired");
    } else if (error instanceof JsonWebTokenError) {
      return sendResponse(res, 401, "Unauthorized access");
    }
    next(error);
  }
};
