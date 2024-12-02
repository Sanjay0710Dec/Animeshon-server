import { NextFunction, Request, Response } from "express";
import prisma from "@/utils/prisma.index";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import { ErrorCodes } from "@/config/error.config";
import ErrorResponse from "@/lib/responses/ErrorResponse";

export async function addComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { animeId, animeEpisodeId, content, spoiler } = req.body as {
    animeId: string;
    animeEpisodeId: string;
    content: string;
    spoiler: boolean;
  };

  try {
    await prisma.comment.create({
      data: {
        userId: req.user_id,
        animeId,
        animeEpisodeId,
        content,
        spoiler,
      },
    });

    sendSuccessResponse(res, "commented");
  } catch (error: any) {
    console.log(error.message);
    next(
      new ErrorResponse(
        "Unable to add your comment, please try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function removeComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const commentSequenceId = (req.body as { commentId: string }).commentId;

  try {
    await prisma.comment.delete({
      where: {
        id: commentSequenceId,
        userId: req.user_id,
      },
    });

    sendSuccessResponse(res, "comment deleted");
  } catch (error: any) {
    console.log(error.message);

    next(
      new ErrorResponse(
        "Unable to delete comment, please try after sometime",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function fetchEpisodeComments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { animeId, animeEpisodeId } = req.body as {
    animeId: string;
    animeEpisodeId: string;
  };

  try {
    const data = await prisma.comment.findMany({
      where: {
        animeId,
        animeEpisodeId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        spoiler: true,
        user: {
          select: {
            username: true,
            profile: true,
          },
        },
      },
    });

    sendSuccessResponse(res, "fetch Successful", data);
  } catch (error: any) {
    console.log(error.message);
    next(
      new ErrorResponse(
        "Unable to fetch comments, please try again",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
