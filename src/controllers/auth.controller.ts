import { RequestHandler } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
const nodeEnv = process.env.NODE_ENV as string;

export const tokenController: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string;
  if (!refreshToken) {
    return res.status(401).send("Refresh token is missing");
  }
  try {
    const tokenData = jwt.verify(
      refreshToken,
      refreshTokenSecret
    ) as jwt.JwtPayload;
    const email = tokenData.email as string;
    const newAccessToken = jwt.sign({ email }, accessTokenSecret, {
      expiresIn: "5m",
    });
    const newRefreshToken = jwt.sign({ email }, refreshTokenSecret, {
      expiresIn: "30d",
    });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: nodeEnv === "production",
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: nodeEnv === "production",
    });
    return res.status(200).send("Tokens refreshed successfully");
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError
    ) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(403).send("Refresh token is expired or invalid");
    }
    console.log(err);
    return res.sendStatus(500);
  }
};
