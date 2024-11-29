import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import searchRouter from "./routes/search.route";
import streamRouter from "./routes/stream.route";
import userRouter from "./routes/user.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/app.config";
import { ErrorCodes, routeNotFound } from "./config/error.config";
import ErrorHandler from "./lib/responses/errorHandler";

const app = express();

const PORT = process.env.PORT || 8081;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(function(_req: Request, res: Response, next: NextFunction) {
  res.removeHeader("X-Powered-By");
  next();
});

app.use("/user", userRouter);
app.use("/anime", searchRouter);
app.use("/anime/stream", streamRouter);

app.get("/", function(_req: Request, res: Response) {
  res.send("Success");
});

app.use("*", function(_req: Request, res: Response) {
  res.status(ErrorCodes.NOT_FOUND).send(routeNotFound);
});

app.use(ErrorHandler);

app.listen(PORT, function() {
  console.log("Server is running on PORT:", PORT);
});
