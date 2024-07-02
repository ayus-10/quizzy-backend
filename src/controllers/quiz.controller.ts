import { RequestHandler } from "express";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";
import generator from "generate-password";
import { QuizInfoModel } from "../model/quiz-info.model";

export const saveQuizInfo: RequestHandler = async (
  req: AuthorizedRequest,
  res
) => {
  const title = req.body.email as string;
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
    return res.status(200).send("Quiz info saved successfully");
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
