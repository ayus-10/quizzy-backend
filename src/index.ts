import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/users.route";
import authRoute from "./routes/auth.route";

dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL as string;
const DB_URI = process.env.DB_URI as string;
const PORT = process.env.PORT || "8080";

const app = express();
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/users", usersRoute);
app.use("/auth", authRoute);

mongoose
  .connect(DB_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`))
  )
  .catch((err) => console.log(err));
