import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;

export const decodeUserTokenMiddleware: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next
) => {
  const accessToken = req.cookies.accessToken as string;
  try {
    const tokenData = jwt.verify(
      accessToken,
      accessTokenSecret
    ) as jwt.JwtPayload;
    const email = tokenData.email as string;
    req.authorizedEmail = email;
    next();
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError
    ) {
      return res.status(403).send("Refresh token is expired or invalid");
    }
    console.log(err);
    return res.sendStatus(500);
  }
};
