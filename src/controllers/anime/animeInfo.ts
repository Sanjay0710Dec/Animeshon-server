import { NextFunction, Request, Response } from "express";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";

async function animeInfo(req: Request, res: Response, next: NextFunction) {
  const animeId = req.params.animeId;

  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/info/${animeId}?provider=${process.env.ANIMEINFO_PROVIDER}`,
    );

    if (!response.ok) {
      return next(new ErrorResponse("Anime not found", ErrorCodes.NOT_FOUND));
    }

    const data = await response.json();
    return sendSuccessResponse(res, "fetch Successful", data);
  } catch (error: any) {
    next(
      new ErrorResponse(
        "Internal Server Error, please try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export default animeInfo;
