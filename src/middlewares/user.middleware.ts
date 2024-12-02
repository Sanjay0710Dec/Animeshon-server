import { NextFunction, Request, Response } from "express";
import { CustomJwtBody, SigninBody, SignupBody } from "../types/user";
import prisma from "@/utils/prisma.index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";
import { isVerificationTokenExpired } from "@/utils/utils.index";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";

export async function checkIfUserExist(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { username, email } = req.body as SignupBody;

  try {
    const response = await prisma.user.findFirst({
      where: {
        OR: [{ username: username, email: email }],
      },
    });

    if (!response) {
      next();
    } else {
      if (response.username === username) {
        next(new ErrorResponse("username already exist", ErrorCodes.CONFLICT));
      } else {
        next(new ErrorResponse("email already exist", ErrorCodes.CONFLICT));
      }
    }
  } catch (error: any) {
    console.log(error.message);
    next(
      new ErrorResponse(
        "Internal server error",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function verifyEmailForRegistrationAndPasswordReset(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const verificationId = (req.params as { verificationId: string })
    .verificationId;
  try {
    const notVerifiedUser = await prisma.userVerification.findFirst({
      where: {
        token: verificationId,
      },
    });
    if (!notVerifiedUser) {
      return next(
        new ErrorResponse(
          "Invalid verification link,request new verification link",
          ErrorCodes.BAD_REQUEST,
        ),
      );
    }

    if (isVerificationTokenExpired(notVerifiedUser.updatedAt)) {
      return next(
        new ErrorResponse(
          "verification link got expired, request new verification link",
          ErrorCodes.BAD_REQUEST,
        ),
      );
    }

    await prisma.userVerification.delete({
      where: {
        token: verificationId,
      },
    });

    if (notVerifiedUser.type === "EMAIL_VERIFICATION") {
      await prisma.user.update({
        where: {
          id: notVerifiedUser.identifier,
        },
        data: {
          isVerified: true,
        },
      });

      res.clearCookie("VERIFICATION_PENDING_USER");
      return sendSuccessResponse(res, "account created", null, 201);
    }

    return sendSuccessResponse(
      res,
      "your email is verified,reset your password",
    );
  } catch (error) {
    next(
      new ErrorResponse(
        "verification failed",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function checkIfUserRegistered(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body as SigninBody;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return next(
        new ErrorResponse(
          "user with email do not exist",
          ErrorCodes.BAD_REQUEST,
        ),
      );
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return next(new ErrorResponse("wrong password", ErrorCodes.BAD_REQUEST));
    }

    next();
  } catch (error: any) {
    console.log(error.message);

    next(
      new ErrorResponse(
        "Internal server error",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export function AuthenitcateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const bearerToken = req.cookies.accessToken as string;

  if (!bearerToken) {
    throw new ErrorResponse("please login", ErrorCodes.UNAUTHORIZED);
  }
  const accessToken = bearerToken.replace("Bearer ", "");

  const jwtPayload = jwt.verify(
    accessToken,
    process.env.JWT_SECRET_KEY as string,
  ) as CustomJwtBody;

  if (jwtPayload) {
    req.user_id = jwtPayload.userId;
    next();
  } else {
    throw new ErrorResponse("please login", ErrorCodes.UNAUTHORIZED);
  }
}

export async function checkIfUserRegisteredToResetPassword(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const email = (req.body as { email: string }).email;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next(
        new ErrorResponse("user with email do not exist", ErrorCodes.NOT_FOUND),
      );
    }

    req.user_id = user.id;
    req.isVerified = user.isVerified;

    next();
  } catch (error: any) {
    console.log(error.message);

    next(
      new ErrorResponse(
        "Internal server error",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function checkIfUserTryingToReRegister(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const email = (req.body as { email: string }).email || "";
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return next(
        new ErrorResponse("user with email do not exist", ErrorCodes.NOT_FOUND),
      );
    }

    if (user.isVerified) {
      return next(
        new ErrorResponse("you are already verified", ErrorCodes.BAD_REQUEST),
      );
    }
    req.user_id = user.id;
    req.isVerified = user.isVerified;
    next();
  } catch (error) {
    next(
      new ErrorResponse(
        "verification failed,please try after sometime",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
