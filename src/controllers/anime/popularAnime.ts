import { NextFunction, Request, Response } from "express";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";

async function popularAnime(req: Request, res: Response, next: NextFunction) {
  const { page, perPage } = req.query as { page: string; perPage: string };

  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/popular?page=${page}&perPage=${perPage}`,
    );

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
    console.log("I am arrived");
  }
}

export default popularAnime;
