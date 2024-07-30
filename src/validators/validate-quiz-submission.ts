import { RequestHandler } from "express";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";
import jwt from "jsonwebtoken";
import { JOIN_TOKEN_SECRET } from "../config";

export const validateQuizSubmission: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next
) => {
  const fullname = req.body.fullname as string;
  if (!fullname) {
    return res.status(400).send("Provided fullname is invalid");
  }
  const joinToken = req.body.joinToken as string;
  try {
    const tokenData = jwt.verify(
      joinToken,
      JOIN_TOKEN_SECRET
    ) as jwt.JwtPayload;
    req.quizId = tokenData.quizId as string;
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError
    ) {
      return res.status(400).send("Token is invalid or expired");
    }
  }
  const quiz = req.body.quizSubmission;
  let submissionValid = false;
  if (Array.isArray(quiz)) {
    submissionValid = quiz.every(
      (q) =>
        typeof q.questionId === "string" &&
        typeof q.selectedAnswerNumber === "number" &&
        q.questionId !== ""
    );
  }
  if (!submissionValid) {
    return res.status(400).send("Quiz submission is not valid");
  }
  next();
};
