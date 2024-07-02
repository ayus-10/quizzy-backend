import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/users.route";
import authRoute from "./routes/auth.route";
import quizRoute from "./routes/quiz.route";
import { CLIENT_URL, DB_URI, PORT } from "./config";

const app = express();
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/users", usersRoute);
app.use("/auth", authRoute);
app.use("/quiz", quizRoute);

mongoose
  .connect(DB_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`))
  )
  .catch((err) => console.log(err));
