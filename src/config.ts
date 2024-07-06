import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || "8080";
export const CLIENT_URL = process.env.CLIENT_URL as string;
export const DB_URI = process.env.DB_URI as string;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
export const NODE_ENV = process.env.NODE_ENV as string;
export const QUIZ_TOKEN_SECRET = process.env.QUIZ_TOKEN_SECRET as string;
