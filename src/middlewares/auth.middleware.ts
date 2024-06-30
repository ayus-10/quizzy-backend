import { RequestHandler } from "express";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies.accessToken as string;
  const refreshToken = req.cookies.refreshToken as string;
  if (!accessToken) {
    return res.status(401).send("Access token is missing");
  }
  if (!refreshToken) {
    return res.status(401).send("Refresh token is missing");
  }
  next();
};
