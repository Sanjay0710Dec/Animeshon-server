import { Response } from "express";

import SuccessResponse from "./SuccessResponse";

function sendSuccessResponse(
  res: Response,
  message: string,
  result: unknown = null,
  statusCode: number = 200,
) {
  res.status(statusCode).json(new SuccessResponse({ message, result }));
}

export default sendSuccessResponse;

