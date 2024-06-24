import { RequestHandler } from "express";
import { UsersModel } from "../model/users.model";
import * as bcrypt from "bcrypt";
import validator from "validator";

const passwordOptions = {
  minLength: 8,
  minNumbers: 1,
  minLowercase: 0,
  minSymbols: 0,
  minUppercase: 0,
};

export const registerController: RequestHandler = async (req, res) => {
  const email = (req.body.email as string).trim().toLowerCase();
  const password = (req.body.password as string).trim();
  try {
    const userExists = await UsersModel.findOne({ email });
    if (userExists) {
      return res.status(400).send("Provided email is already registered");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error occured");
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
      .send(
        "Password must be at least 8 characters containing letters and numbers"
      );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UsersModel({
    email: email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    return res.status(201).send("Successfully registered user account");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error occured");
  }
};
