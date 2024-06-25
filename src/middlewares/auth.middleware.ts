import { RequestHandler } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;

export const authMiddleware: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next
) => {
  const accessToken = req.cookies.accessToken as string;
  if (!accessToken) {
    return res.status(401).send("Access token is missing");
  }
  try {
    const tokenData = jwt.verify(
      accessToken,
      accessTokenSecret
    ) as jwt.JwtPayload;
    req.authorizedEmail = tokenData.email;
    next();
  } catch (err) {
    return res.status(401).send("Access token is invalid");
  }
};
