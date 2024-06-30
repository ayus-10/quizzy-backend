import { RequestHandler } from "express";
import { UsersModel } from "../model/users.model";
import * as bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const passwordOptions = {
  minLength: 8,
  minNumbers: 1,
  minLowercase: 0,
  minSymbols: 0,
  minUppercase: 0,
};

export const registerUser: RequestHandler = async (req, res) => {
  const email = req.body.email as string;
  const password = req.body.password as string;
  try {
    const userExists = await UsersModel.findOne({ email });
    if (userExists) {
      return res.status(400).send("Provided email is already registered");
    }
    if (!validator.isEmail(email)) {
      return res.status(406).send("Please provide a valid email");
    }
    const passwordValidationResult = validator.isStrongPassword(
      password,
      passwordOptions
    );
    if (!passwordValidationResult) {
      return res
        .status(406)
        .send("Password must be 8+ characters with both letters and numbers");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UsersModel({
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).send("Successfully registered user account");
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
const nodeEnv = process.env.NODE_ENV as string;

export const loginUser: RequestHandler = async (req, res) => {
  const email = req.body.email as string;
  const password = req.body.password as string;
  try {
    const userFound = await UsersModel.findOne({ email });
    if (!userFound) {
      return res.status(400).send(`User ${email} is not registered`);
    }
    const passwordCorrect = await bcrypt.compare(password, userFound.password);
    if (!passwordCorrect) {
      return res.status(401).send("The password is incorrect");
    }
    const accessToken = jwt.sign({ email }, accessTokenSecret, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign({ email }, refreshTokenSecret, {
      expiresIn: "30d",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: nodeEnv === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: nodeEnv === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).send(`Logged in as ${email}`);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export const logoutUser: RequestHandler = (_req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).send("Logged out successfully");
};
