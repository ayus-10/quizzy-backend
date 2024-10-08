import { RequestHandler } from "express";
import validator from "validator";
import jwt from "jsonwebtoken";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";
import { QuizInfoModel } from "../models/quiz-info.model";
import { getCurrentTime } from "../utils/get-current-time";
import { JOIN_TOKEN_SECRET } from "../config";
import { QuizQuestionModel } from "../models/quiz-question.model";
import { SubmittedQuestion } from "../interfaces/submitted-question.interface";
import { QuizSubmissionModel } from "../models/quiz-submission.model";
import { QuizResultDetailed } from "../interfaces/quiz-result-detailed.interface";

export const verifyJoin: RequestHandler = async (
  req: AuthorizedRequest,
  res
) => {
  const fullname = req.body.fullname as string;
  const quizId = req.quizId as string;
  if (!validator.isAlphanumeric(fullname, undefined, { ignore: " " })) {
    return res.status(400).send("Please enter a valid name");
  }
  try {
    const quizInfo = await QuizInfoModel.findOne({ id: quizId });
    const startTime = quizInfo?.startTime as number;
    const endTime = quizInfo?.endTime as number;
    const quizTitle = quizInfo?.title as string;
    const currentTime = getCurrentTime();
    if (currentTime >= endTime) {
      return res.status(400).send("The quiz has already ended");
    }
    const joinToken = jwt.sign({ quizId }, JOIN_TOKEN_SECRET, {
      expiresIn: (endTime - startTime) * 1000 + 1000 * 60 * 5, // 5 minutes grace period
    });
    return res
      .status(200)
      .json({ fullname, quizId, quizTitle, joinToken, startTime, endTime });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export const joinQuiz: RequestHandler = async (req, res) => {
  const joinToken = req.body.joinToken as string;
  try {
    const tokenData = jwt.verify(
      joinToken,
      JOIN_TOKEN_SECRET
    ) as jwt.JwtPayload;
    const quizId = tokenData.quizId as string;
    const quizInfo = await QuizInfoModel.findOne({ id: quizId });
    const startTime = quizInfo?.startTime as number;
    const currentTime = getCurrentTime();
    if (currentTime < startTime) {
      return res.status(400).send("Can not join early");
    }
    const quizQuestions = await QuizQuestionModel.find({ quizId });
    const quizQuestionsFiltered = quizQuestions.map((q) => {
      return {
        questionId: q._id,
        quizId: q.quizId,
        question: q.question,
        answerChoices: q.answerChoices,
      };
    });
    return res.status(200).json(quizQuestionsFiltered);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).send("Not verified to join the quiz");
    } else if (err instanceof jwt.TokenExpiredError) {
      return res.status(400).send("Too late to join the quiz");
    }
    return res.sendStatus(500);
  }
};

export const submitQuiz: RequestHandler = async (
  req: AuthorizedRequest,
  res
) => {
  const quizId = req.quizId as string;
  const fullname = req.body.fullname as string;
  const submittedQuestions = req.body.submittedQuestions as SubmittedQuestion[];
  try {
    const quizQuestions = await QuizQuestionModel.find({ quizId });
    // Adding correct answer to every question object in submittedQuestion
    submittedQuestions.forEach((sq) => {
      const currentId = sq.questionId;
      const quizQuestion = quizQuestions.find((qq) => qq._id.equals(currentId));
      sq.correctAnswerNumber = Number(quizQuestion?.correctChoice);
    });
    const duplicateSubmission = await QuizSubmissionModel.findOne({
      quizId,
      submittedBy: fullname,
    });
    if (duplicateSubmission) {
      return res.status(400).send("Duplicate submissions are not allowed");
    }
    const quizSubmission = new QuizSubmissionModel({
      quizId,
      submittedBy: fullname,
      submittedQuestions,
    });
    const result = await quizSubmission.save();
    return res.status(200).json({ quizId, submittedBy: fullname });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export const getResult: RequestHandler = async (req, res) => {
  const quizId = req.query.id as string;
  const fullname = req.query.fullname as string;
  if (!quizId || !fullname) {
    return res.status(400).send("ID or Fullname not provided");
  }
  try {
    const quizSubmission = await QuizSubmissionModel.findOne({
      quizId,
      submittedBy: fullname,
    });
    const quizQuestions = await QuizQuestionModel.find({ quizId });
    const results: QuizResultDetailed[] = [];
    quizSubmission?.submittedQuestions.forEach((sq) => {
      const currentQuizQuestions = quizQuestions.find((qq) =>
        qq._id.equals(sq.questionId)
      );
      results.push({
        questionId: sq.questionId,
        questionText: String(currentQuizQuestions?.question),
        correctAnswerNumber: sq.correctAnswerNumber,
        selectedAnswerNumber: sq.selectedAnswerNumber,
        correctAnswerText: String(
          currentQuizQuestions?.answerChoices[sq.correctAnswerNumber - 1]
        ),
        selectedAnswerText:
          currentQuizQuestions?.answerChoices[sq.selectedAnswerNumber - 1] ??
          "UNATTEMPTED",
      });
    });
    return res.status(200).json({ results });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
