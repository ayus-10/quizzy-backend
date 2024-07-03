import { RequestHandler } from "express";
import validator from "validator";

const getCurrentTimeStamp = () => {
  const currentUTCDate = new Date().toISOString();
  const timeStamp = new Date(currentUTCDate).getTime();
  return timeStamp;
};

export const validateQuizInfo: RequestHandler = async (req, res, next) => {
  const { title, startTime, endTime } = req.body;

  const currentTimeStamp = getCurrentTimeStamp();

  const oneHour = 60 * 60 * 1000;

  if (!title || !startTime || !endTime) {
    return res.status(400).send("Please fill up all the fields");
  }

  if (!validator.isAlphanumeric(title, undefined, { ignore: " " })) {
    return res.status(400).send("Title can only contain alphabets and numbers");
  }

  if (typeof startTime !== "number" || typeof endTime !== "number") {
    return res.status(400).send("Start/End time is invalid");
  }

  if (currentTimeStamp >= startTime) {
    return res
      .status(400)
      .send("Start time can not be before than current time");
  }

  if (startTime >= endTime) {
    return res.status(400).send("End time can not be before start time");
  }

  if (endTime - startTime < oneHour) {
    return res
      .status(400)
      .send("Start and End time must be at least 1 hr apart");
  }

  next();
};
