import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";

export const decodeUserTokenMiddleware: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next
) => {
  const accessToken = req.cookies.accessToken as string;
  try {
    const tokenData = jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET
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
