import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET, NODE_ENV } from "../config";
import { AuthorizedRequest } from "../interfaces/authorized-request.interface";

export const refreshUserTokens: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string;
  try {
    const tokenData = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    ) as jwt.JwtPayload;
    const email = tokenData.email as string;
    const newAccessToken = jwt.sign({ email }, ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    const newRefreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
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

export const getUserEmail: RequestHandler = async (
  req: AuthorizedRequest,
  res
) => {
  const email = req.authorizedEmail;
  return res.status(200).json({ email });
};
