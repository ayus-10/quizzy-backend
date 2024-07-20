import { RequestHandler } from "express";
import validator from "validator";
import jwt from "jsonwebtoken";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";
import { QuizInfoModel } from "../model/quiz-info.model";
import { getCurrentTime } from "../utils/get-current-time";
import { JOIN_TOKEN_SECRET } from "../config";
import { QuizQuestionModel } from "../model/quiz-question.model";

export const verifyJoin: RequestHandler = async (
  req: AuthorizedRequest,
  res
) => {
  const fullname = req.body.fullname as string;
  const quizId = req.quizId as string;
  if (
    !fullname ||
    validator.isAlphanumeric(fullname, undefined, { ignore: " " })
  ) {
    return res.status(400).send("Please enter a valid name");
  }
  try {
    const quizInfo = await QuizInfoModel.findOne({ id: quizId });
    const startTime = quizInfo?.startTime as number;
    const endTime = quizInfo?.endTime as number;
    const currentTime = getCurrentTime();
    const waitDuration = startTime - currentTime;
    if (currentTime >= endTime) {
      return res.status(400).send("The quiz has already ended");
    }
    const joinToken = jwt.sign({ quizId, startTime }, JOIN_TOKEN_SECRET, {
      expiresIn: (endTime - startTime) * 1000,
    });
    return res.status(200).json({ joinToken, waitDuration });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export const joinQuiz: RequestHandler = async (req, res) => {
  const joinToken = req.params.token as string;
  try {
    const tokenData = jwt.verify(
      joinToken,
      JOIN_TOKEN_SECRET
    ) as jwt.JwtPayload;
    const quizId = tokenData.quizId as string;
    const startTime = tokenData.startTime as number;
    const currentTime = getCurrentTime();
    if (currentTime < startTime) {
      return res.status(400).send("Can not join early");
    }
    const quizQuestions = await QuizQuestionModel.find({ quizId });
    return res.status(200).json({ quizQuestions });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).send("Not verified to join the quiz");
    } else if (err instanceof jwt.TokenExpiredError) {
      return res.status(400).send("Too late to join the quiz");
    }
  }
};
