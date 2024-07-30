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
      expiresIn: "1y",
    });
    return res.status(200).json({ quizToken });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export const getAllQuizInfo: RequestHandler = async (
  req: AuthorizedRequest,
  res
) => {
  const email = req.authorizedEmail;
  try {
    const infos = await QuizInfoModel.find({ createdBy: email }).exec();
    return res.status(200).json({ infos });
  } catch (err) {
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

export const getQuizQuestions: RequestHandler = async (
  req: AuthorizedRequest,
  res
) => {
  const quizId = req.quizId;
  try {
    const quiz = await QuizQuestionModel.find({ quizId }).exec();
    return res.status(200).json({ quiz });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export const deleteQuiz: RequestHandler = async (req, res) => {
  const id = req.params.id;
  try {
    await QuizInfoModel.deleteOne({ id });
    await QuizQuestionModel.deleteMany({ quizId: id });
    return res.status(200).send("Successfully deleted the quiz");
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export const updateQuizQuestions: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const quizQuestions = req.body.quizQuestions as QuizQuestion[];
  quizQuestions.forEach((q) => (q.quizId = id)); // quizId property will not to be present in each object
  try {
    await QuizQuestionModel.deleteMany({ quizId: id });
    await QuizQuestionModel.insertMany(quizQuestions);
    return res.status(200).send("Successfully updated the questions");
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
