import { ErrorCodes } from "@/config/error.config";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { NextFunction, Request, Response } from "express";
import primsa from "@/utils/prisma.index";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";

async function userFeedBackAndSuggestion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { feedback, suggestion } = req.body as {
    feedback: string;
    suggestion: string;
  };

  if (!feedback) {
    return next(new ErrorResponse("feedback required", ErrorCodes.BAD_REQUEST));
  }
  try {
    await primsa.userFeedBack.create({
      data: {
        feedback,
        suggestion,
      },
    });

    return sendSuccessResponse(res, "thanks for the feedback");
  } catch (error) {
    next(
      new ErrorResponse("feedback failed", ErrorCodes.INTERNAL_SERVER_ERROR),
    );
  }
}

export default userFeedBackAndSuggestion;
