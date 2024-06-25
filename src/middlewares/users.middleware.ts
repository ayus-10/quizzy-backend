import { RequestHandler } from "express";

export const usersMiddleware: RequestHandler = (req, res, next) => {
  const email = req.body.email as string;
  const password = req.body.password as string;
  if (!email || !password) {
    return res.status(400).send("Please provide email and password");
  }
  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedPassword = password.trim();
  req.body.email = sanitizedEmail;
  req.body.password = sanitizedPassword;
  next();
};
