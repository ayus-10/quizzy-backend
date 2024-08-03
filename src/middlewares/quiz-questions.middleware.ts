import { RequestHandler } from "express";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";
import { QuizInfoModel } from "../models/quiz-info.model";

export const quizQuestionsMiddleware: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next
) => {
  // Depending on whether it is a GET or POST request, id and password will be passed over request query or body
  const id = (req.query.id ?? req.body.id) as string;
  const password = (req.query.password ?? req.body.password) as string;
  const hasCredentials = !!(id && password);
  if (hasCredentials) {
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
    return res.status(400).send("Quiz credentials must be provided");
  }
};
