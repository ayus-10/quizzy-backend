import { RequestHandler } from "express";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";
import { QuizInfoModel } from "../model/quiz-info.model";

export const manageQuizMiddleware: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next
) => {
  const email = req.authorizedEmail;
  const id = req.params.id;
  try {
    const info = await QuizInfoModel.findOne({ id });
    if (info && info.createdBy !== email) {
      return res.status(401).send("You are not allowed to manage this quiz");
    }
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
