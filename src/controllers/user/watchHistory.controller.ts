import { NextFunction, Request, Response } from "express";
import primsa from "@/utils/prisma.index";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";
export async function addAnimeEpisodeToWatchHistory(req: Request, res: Response,next:NextFunction) {
    const { animeId, animeEpisodeId } = (req.body as { animeId: string, animeEpisodeId: string });

    try {
        const response = await primsa.watchHistory.create({
            data: {
                userId: req.user_id,
                animeId,
                animeEpisodeId
            }
        });

        console.log(response);

       sendSuccessResponse(res,"added episode to watch history");

    } catch (error: any) {

        console.log(error.message);

        next(
            new ErrorResponse(
              "Unable to add episode to watch history",
              ErrorCodes.INTERNAL_SERVER_ERROR
            )
          );
    }
}

export async function removeAnimeEpisodeFromWatchHistory(req: Request, res: Response,next:NextFunction) {
    const animeSequenceEpisodeId = (req.body as { animeSequenceEpisodeId: string }).animeSequenceEpisodeId;

    try {
        const response = await primsa.watchHistory.delete({
            where: {
                id: animeSequenceEpisodeId
            }
        });
        console.log(response);

      sendSuccessResponse(res,"episode deleted from watchHistory");

    } catch (error: any) {

        console.log(error.message);
        next(
            new ErrorResponse(
              "Unable to delete episode from watchHistory",
              ErrorCodes.INTERNAL_SERVER_ERROR
            )
          );

    }
}

export async function fetchUserWatchHistory(req: Request, res: Response,next:NextFunction) {

    try {

        const data = await primsa.watchHistory.findMany({
            where: {
                userId: req.user_id
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                animeId: true,
                animeEpisodeId: true,
                createdAt: true
            }
        });

         sendSuccessResponse(res,"fetch Successful",data);

    } catch (error: any) {

        console.log(error.message);

        next(
            new ErrorResponse(
              "Unable to get  watchHistory, please try again",
              ErrorCodes.INTERNAL_SERVER_ERROR
            )
          );
    }
}

export async function deleteUserWatchHistory(req: Request, res: Response,next:NextFunction) {

    try {
        await primsa.watchHistory.deleteMany({
            where: {
                userId: req.user_id
            }
        });

        sendSuccessResponse(res,"deleted watchHistory")
    } catch (error: any) {

        console.log(error.message);

        next(
            new ErrorResponse(
              "Unable to deltet watchHistory",
              ErrorCodes.INTERNAL_SERVER_ERROR
            )
          );
    }
}