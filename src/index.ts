import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/users.route";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const DB_URI = process.env.DB_URI as string;
const PORT = process.env.PORT || 8080;

app.use("/users", usersRoute);

mongoose
  .connect(DB_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`))
  )
  .catch((err) => console.log(err));
