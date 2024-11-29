import { NextFunction, Request, Response } from "express";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";

async function top10AnimeInfo(req: Request, res: Response, next: NextFunction) {
  const top10InfoId = (req.params as { top10InfoId: string }).top10InfoId;

  try {
    const response = await fetch(
      `${process.env.BACKEND_STREAM_URL}/anime/${top10InfoId}`,
    );

    if (!response.ok) {
      return next(new ErrorResponse(response.statusText, ErrorCodes.NOT_FOUND));
    }
    const jsonResponse = await response.json();

    if (jsonResponse?.data?.anime?.info?.anilistId) {
      return res.redirect(
        303,
        `/anime/info/${jsonResponse.data.anime.info.anilistId}`,
      );
    }
    next(new ErrorResponse("Anime not found", ErrorCodes.NOT_FOUND));
  } catch (error: any) {
    next(
      new ErrorResponse(
        "Internal Server Error, please try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
export default top10AnimeInfo;
