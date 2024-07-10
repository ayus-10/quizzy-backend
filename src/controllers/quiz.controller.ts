import { RequestHandler } from "express";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";
import generator from "generate-password";
import { QuizInfoModel } from "../model/quiz-info.model";
import jwt from "jsonwebtoken";
import { QUIZ_TOKEN_SECRET } from "../config";
import { QuizQuestion } from "../interfaces/quiz-question.interface";
import { QuizQuestionModel } from "../model/quiz-question.model";

export const saveQuizInfo: RequestHandler = async (
  req: AuthorizedRequest,
  res
) => {
  const title = req.body.title as string;
  const startTime = req.body.startTime as number;
  const endTime = req.body.endTime as number;
  const email = req.authorizedEmail as string;

  const id = generator.generate({
    lowercase: false,
    uppercase: false,
    numbers: true,
  });

  const password = generator.generate();

  try {
    const newQuizInfo = new QuizInfoModel({
      id,
      title,
      startTime,
      endTime,
      createdBy: email,
      password,
    });
    await newQuizInfo.save();
    const quizToken = jwt.sign({ id }, QUIZ_TOKEN_SECRET, {
      expiresIn: "3h",
    });
    return res.status(200).json({ quizToken });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export const getQuizInfo: RequestHandler = async (req, res) => {
  const quizToken = String(req.params.token);
  try {
    const tokenData = jwt.verify(
      quizToken,
      QUIZ_TOKEN_SECRET
    ) as jwt.JwtPayload;
    const id = tokenData.id as string;
    const quizInfo = await QuizInfoModel.findOne({ id });
    return res.status(200).json({ quizInfo });
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
};

export const saveQuizQuestions: RequestHandler = async (
  req: AuthorizedRequest,
  res
) => {
  const quizId = req.quizId as string;
  const quizQuestions = req.body.quizQuestions as QuizQuestion[];
  quizQuestions.forEach((q) => (q.quizId = quizId)); // quizId property will not to be present in each object
  try {
    await QuizQuestionModel.insertMany(quizQuestions);
    return res.status(200).send("Questions submitted successfully");
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
