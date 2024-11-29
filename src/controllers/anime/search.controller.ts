import { NextFunction, Request, Response } from "express";
import { AdvancedSearchQuery } from "@/types/search";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";

export async function basicAnimeSearch(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const query = (req.params as { query: string }).query;

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/${query}`);

    if (!response.ok) {
      return next(new ErrorResponse(response.statusText, response.status));
    }

    const data = await response.json();
    if (data.results.length > 0) {
      return sendSuccessResponse(res, "fetch Successful", data);
    }
    next(new ErrorResponse("not found", ErrorCodes.NOT_FOUND));
  } catch (error: any) {
    next(
      new ErrorResponse(
        "Internal Server Error, please try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function advancedAnimeSearch(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let BACKEND_API_URL: string =
    process.env.BACKEND_API_URL + "/advanced-search?";

  const { page, perPage, type, genres, format, status, year, season } =
    req.query as AdvancedSearchQuery;

  let isNotFirstQuery: boolean = false;

  if (type) {
    BACKEND_API_URL = BACKEND_API_URL + `type=${type}`;
    isNotFirstQuery = true;
  }
  if (genres?.length) {
    BACKEND_API_URL = isNotFirstQuery
      ? BACKEND_API_URL + `&genres=${genres}`
      : BACKEND_API_URL + `genres=${genres}`;
    isNotFirstQuery = true;
  }
  if (format) {
    BACKEND_API_URL = isNotFirstQuery
      ? BACKEND_API_URL + `&format=${format}`
      : BACKEND_API_URL + `format=${format}`;
    isNotFirstQuery = true;
  }
  if (status) {
    BACKEND_API_URL = isNotFirstQuery
      ? BACKEND_API_URL + `&status=${status}`
      : BACKEND_API_URL + `status=${status}`;
    isNotFirstQuery = true;
  }
  if (year) {
    BACKEND_API_URL = isNotFirstQuery
      ? BACKEND_API_URL + `&year=${year}`
      : BACKEND_API_URL + `year=${year}`;
    isNotFirstQuery = true;
  }
  if (season) {
    BACKEND_API_URL = isNotFirstQuery
      ? BACKEND_API_URL + `&season=${season}`
      : BACKEND_API_URL + `season=${season}`;
    isNotFirstQuery = true;
  }
  if (page) {
    BACKEND_API_URL = BACKEND_API_URL + `&page=${page}`;
    isNotFirstQuery = true;
  }
  if (perPage) {
    BACKEND_API_URL = BACKEND_API_URL + `&perPage=${perPage}`; // the number of results will change according to size of userDevice.
    isNotFirstQuery = true;
  }
  if (!isNotFirstQuery) {
    BACKEND_API_URL = BACKEND_API_URL + `page=1`; // assumed no filters are applied
  }
  try {
    const response = await fetch(BACKEND_API_URL);
    if (!response.ok) {
      return next(new ErrorResponse(response.statusText, response.status));
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
