import { NextFunction, Request, Response } from "express";
import prisma from "@/utils/prisma.index";
import bcrypt from "bcryptjs";
import { SignupBody } from "@/types/user";
import { cookieOptions } from "@/config/app.config";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";
import { HASH_SALT_ROUNDS } from "@/config/auth.config";
import { v4 as uuid } from "uuid";
import { sendEmail } from "@/lib/sendVerificationEmail";
import primsa from "@/utils/prisma.index";
import { createVerificationLink } from "@/utils/utils.index";

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username, email, password } = req.body as SignupBody;

  try {
    const hashedPassword = await bcrypt.hash(password, HASH_SALT_ROUNDS);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const verificationToken = await prisma.userVerification.create({
      data: {
        token: uuid(),
        identifier: newUser.id,
        type: "EMAIL_VERIFICATION",
      },
    });
    const verificationLink = createVerificationLink(
      newUser.isVerified,
      verificationToken.token,
    );
    console.log(verificationLink);
    await sendEmail(email, verificationToken.type, verificationLink);
    res.cookie(
      "VERIFICATION_PENDING_USER",
      verificationToken.identifier,
      cookieOptions,
    );
    sendSuccessResponse(res, "verificationLink is sent to your email");
  } catch (error) {
    next(
      new ErrorResponse(
        "Account creation Failed",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
export async function resendVerificationLink(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // In case someone deletes the cookie.
  const pending_user_id =
    (req.cookies as { VERIFICATION_PENDING_USER: string })
      .VERIFICATION_PENDING_USER || "";

  try {
    const user = await primsa.user.findUnique({
      where: {
        id: pending_user_id,
      },
    });
    if (!user) {
      return next(
        new ErrorResponse("resource not found", ErrorCodes.NOT_FOUND),
      );
    }

    const verificationEntry = await prisma.userVerification.update({
      where: {
        identifier: user.id,
      },
      data: {
        token: uuid(),
      },
    });

    const verificationLink = createVerificationLink(
      user.isVerified,
      verificationEntry.token,
    );

    await sendEmail(user.email, verificationEntry.type, verificationLink);
    return sendSuccessResponse(
      res,
      "a new verificationLink has been sent to your email",
    );
  } catch (error) {
    next(
      new ErrorResponse(
        "unable to send verificationLink,try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function sendResetPasswordVerificationLink(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const email = (req.body as { email: string }).email;
  const userId = req.user_id;
  try {
    const resetPasswordVerificationEntry = await primsa.userVerification.create(
      {
        data: {
          token: uuid(),
          identifier: userId,
          type: "RESET_PASSWORD",
        },
      },
    );
    const verificationLink = createVerificationLink(
      true,
      resetPasswordVerificationEntry.token,
    );
    await sendEmail(
      email,
      resetPasswordVerificationEntry.type,
      verificationLink,
    );
    return sendSuccessResponse(
      res,
      "a verificationLink has been sent your email",
    );
  } catch (error) {
    next(
      new ErrorResponse(
        "not able to send verificationLink, try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function sendVerificationLinkForResourceNotFound(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const email = (req.body as { email: string }).email;
  const userId = req.user_id;
  const isVerified = req.isVerfied;
  try {
    const verificationEntry = await primsa.userVerification.update({
      where: {
        identifier: userId,
      },
      data: {
        token: uuid(),
      },
    });

    const verificationLink = createVerificationLink(
      isVerified,
      verificationEntry.token,
    );

    await sendEmail(email, verificationEntry.type, verificationLink);
    return sendSuccessResponse(
      res,
      "a verificationLink has been sent to your email",
    );
  } catch (error) {
    next(
      new ErrorResponse(
        "not able to send verificationLink, try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

