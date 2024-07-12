import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { QUIZ_TOKEN_SECRET } from "../config";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";

export const decodeQuizTokenMiddleware: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next
) => {
  const quizToken = req.params.token as string;
  if (!quizToken) {
    return res.status(400).send("Quiz token is missing");
  }
  try {
    const tokenData = jwt.verify(
      quizToken,
      QUIZ_TOKEN_SECRET
    ) as jwt.JwtPayload;
    req.quizId = tokenData.id as string;
    next();
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError
    ) {
      return res.status(400).send("Quiz token is invalid or expired");
    }
    console.log(err);
    return res.sendStatus(500);
  }
};
