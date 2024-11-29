import { NextFunction, Request, Response } from "express";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";
async function top10Anime(_req: Request, res: Response, next: NextFunction) {
  try {
    const response = await fetch(`${process.env.BACKEND_STREAM_URL}/home`);

    if (!response.ok) {
      return next(new ErrorResponse(response.statusText, response.status));
    }

    const jsonResponse = await response.json();

    if (jsonResponse?.data?.top10Animes) {
      return sendSuccessResponse(
        res,
        "fetch Successful",
        jsonResponse.data.top10Animes,
      );
    }
    next(new ErrorResponse("not data found", ErrorCodes.NOT_FOUND));
  } catch (error: any) {
    next(
      new ErrorResponse(
        "Internal Server Error, please try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export default top10Anime;
