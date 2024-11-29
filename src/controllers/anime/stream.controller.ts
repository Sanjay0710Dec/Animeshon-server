import { NextFunction, Request, Response } from "express";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";

export async function animeEpisodes(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const animeId = (req.query as { animeId: string }).animeId;

  try {
    const response = await fetch(
      `${process.env.BACKEND_STREAM_URL}/anime/${animeId}/episodes`,
    );

    if (!response.ok) {
      return next(new ErrorResponse(response.statusText, response.status));
    }

    const jsonResponse = await response.json();
    if (jsonResponse?.data?.episodes?.length > 0) {
      return sendSuccessResponse(res, "fetch Successful", jsonResponse.data);
    }
    next(new ErrorResponse("no episodes found", ErrorCodes.NOT_FOUND));
  } catch (error: any) {
    next(
      new ErrorResponse(
        "Internal Server Error, please try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function animeEpisodeStreamingLinks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { animeEpisodeId, category } = req.query as {
    animeEpisodeId: string;
    category: string;
  };
  try {
    const response = await fetch(
      `${process.env.BACKEND_STREAM_URL}/episode/sources?animeEpisodeId=${animeEpisodeId}&category=${category}`,
    );

    if (!response.ok) {
      return next(new ErrorResponse(response.statusText, response.status));
    }
    const jsonResponse = await response.json();

    return sendSuccessResponse(res, "fetch Successful", jsonResponse.data);
  } catch (error: any) {
    next(
      new ErrorResponse(
        "Internal Server Error, please try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
