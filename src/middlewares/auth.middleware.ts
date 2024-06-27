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
  const refreshToken = req.cookies.refreshToken as string;
  if (!accessToken) {
    return res.status(401).send("Access token is missing");
  }
  if (!refreshToken) {
    return res.status(401).send("Refresh token is missing");
  }
  try {
    const tokenData = jwt.verify(
      accessToken,
      accessTokenSecret
    ) as jwt.JwtPayload;
    req.authorizedEmail = tokenData.email;
    next();
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError
    ) {
      res.clearCookie("accessToken");
      return res.status(403).send("Access token is expired or invalid");
    }
    console.log(err);
    return res.sendStatus(500);
  }
};
