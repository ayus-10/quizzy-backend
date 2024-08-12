import { RequestHandler } from "express";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";
import { QuizInfoModel } from "../models/quiz-info.model";

export const quizQuestionsMiddleware: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next
) => {
  const id = (req.query.id ?? req.body.id) as string;
  const password = req.body.password as string;
  try {
    if (id && password) {
      const quiz = await QuizInfoModel.findOne({ id });
      if (password !== quiz?.password) {
        return res.status(400).send("Either ID or Password is incorrect");
      }
      req.quizId = id;
      next();
    } else if (id) {
      const quiz = await QuizInfoModel.findOne({ id });
      const email = req.authorizedEmail as string;
      if (quiz?.createdBy !== email) {
        return res.status(400).send("Not allowed to view the quiz questions");
      }
      req.quizId = id;
      next();
    } else {
      return res.status(400).send("Quiz credentials must be provided");
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
