import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { QUIZ_TOKEN_SECRET } from "../config";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";
import { QuizInfoModel } from "../model/quiz-info.model";

export const quizQuestionsMiddleware: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next
) => {
  const quizToken = req.body.token as string;
  const id = req.body.id as string;
  const password = req.body.password as string;
  const hasToken = !!quizToken;
  const hasCredentials = !!(id && password);
  if (hasToken) {
    try {
      const tokenData = jwt.verify(
        quizToken,
        QUIZ_TOKEN_SECRET
      ) as jwt.JwtPayload;
      const id = tokenData.id as string;
      req.quizId = id;
      next();
    } catch (err) {
      if (
        err instanceof jwt.JsonWebTokenError ||
        err instanceof jwt.TokenExpiredError
      ) {
        return res.status(400).send("Token is invalid or expired");
      }
      console.log(err);
      return res.sendStatus(500);
    }
  } else if (hasCredentials) {
    try {
      const quiz = await QuizInfoModel.findOne({ id });
      if (!quiz || password !== quiz.password) {
        return res.status(400).send("Either ID or Password is incorrect");
      }
      req.quizId = id;
      next();
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  } else {
    return res.status(400).send("Either token or credentials must be provided");
  }
};
