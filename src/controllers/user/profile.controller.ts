import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma.index";
import { signedUrlToPutObject } from "@/lib/s3uploader";
import sendSuccessResponse from "@/lib/responses/sendSuccessResponse";
import ErrorResponse from "@/lib/responses/ErrorResponse";
import { ErrorCodes } from "@/config/error.config";

export async function giveSignedUrlToUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { fileName, fileType } = req.body as {
    fileName: string;
    fileType: string;
  };

  // if(!fileName || !fileType){

  //     return res.status(StatusCodes.BAD_REQUEST).json({
  //         success:false,
  //         data:{
  //             message:"please upload file"   // use only when your working without frontend.
  //         }
  //     })
  // }

  try {
    const signedUrl = await signedUrlToPutObject(fileName, fileType);

    sendSuccessResponse(res, "fetch Successful", signedUrl);
  } catch (error: any) {
    console.error(error.message);
    next(
      new ErrorResponse(
        "Unable to update profile, please try after sometime",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function updateUserProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const fileName = (req.body as { fileName: string }).fileName;

  try {
    await prisma.user.update({
      where: {
        id: req.user_id,
      },
      data: {
        profile: fileName,
      },
    });

    sendSuccessResponse(res, "profile updated");
  } catch (error: any) {
    console.error(error.message);

    next(
      new ErrorResponse(
        "Unable to update profile, please try after sometime",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function updateUserBanner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const fileName = (req.body as { fileName: string }).fileName;

  try {
    await prisma.user.update({
      where: {
        id: req.user_id,
      },
      data: {
        profile: fileName,
      },
    });
    sendSuccessResponse(res, "banner updated");
  } catch (error: any) {
    console.error(error.message);

    next(
      new ErrorResponse(
        "Unable to update banner, please try after sometime",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function updateUsername(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const username = (req.body as { username: string }).username;

  try {
    await prisma.user.update({
      where: {
        id: req.user_id,
      },
      data: {
        username,
      },
      select: {
        username: true,
      },
    });
    sendSuccessResponse(res, "username updated");
  } catch (error: any) {
    console.error(error.message);

    next(
      new ErrorResponse(
        "Unable to update username, please try after sometime",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function deleteUserAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await prisma.user.delete({
      where: {
        id: req.user_id,
      },
    });

    sendSuccessResponse(res, "account deleted");
  } catch (error: any) {
    console.error(error.message);
    next(
      new ErrorResponse(
        "Unable to delete you account, please try after sometime",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
