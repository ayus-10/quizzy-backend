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

export const registerController: RequestHandler = async (req, res) => {
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
    return res.status(500).send("Internal server error occured");
  }
};

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
const nodeEnv = process.env.NODE_ENV as string;

export const loginController: RequestHandler = async (req, res) => {
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
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign({ email }, refreshTokenSecret, {
      expiresIn: "1y",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: nodeEnv === "production",
    });
    return res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error occured");
  }
};
