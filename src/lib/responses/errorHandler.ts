import ErrorResponse from "./ErrorResponse";
import { NextFunction, Request, Response } from "express";

function ErrorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ErrorResponse) {
    const { statusCode, message, result, success } = error;

    res.status(statusCode).json({
      success,
      data: {
        message,
        result,
      },
    });
  } else {
    res.status(500).json({
      success: false,
      data: {
        message: "Internal Server Error",
        result: null,
      },
    });
  }
}

export default ErrorHandler;
