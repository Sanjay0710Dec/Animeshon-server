import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import prisma from "../../utils/prisma.index";
import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "@/config/error.config";
import ErrorResponse from "@/lib/responses/ErrorResponse";

export async function addAnimeToFavorites(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const animeId = (req.body as { animeId: string }).animeId;
  try {
    await prisma.favoriteAnime.create({
      data: {
        userId: req.user_id,
        animeId,
      },
    });

    sendSuccessResponse(res, "Anime added to favorites");
  } catch (error: any) {
    console.log(error.message);
    next(
      new ErrorResponse(
        "Unable to add anime to favorites, please try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function removeAnimeFromFavorites(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const animeSequenceId = (req.body as { animeSequenceId: string })
    .animeSequenceId;

  try {
    await prisma.favoriteAnime.delete({
      where: {
        id: animeSequenceId,
      },
    });

    sendSuccessResponse(res, "Anime deleted from favorties");
  } catch (error: any) {
    console.log(error.message);
    next(
      new ErrorResponse(
        "Unable to delete Anime from Favorites",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function fetchUserFavorites(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await prisma.favoriteAnime.findMany({
      where: {
        userId: req.user_id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        animeId: true,
        createdAt: true,
      },
    });
    sendSuccessResponse(res, "fetch Successful", data);
  } catch (error: any) {
    console.log(error.message);
    next(
      new ErrorResponse(
        "Unable to get favorites, please try after sometime",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
