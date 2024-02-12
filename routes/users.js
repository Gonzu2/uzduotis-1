require("dotenv").config();
const express = require("express");
const usersRouter = express.Router();
const mongoose = require("mongoose");
const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");

mongoose
  .connect(`${process.env.DATABASE_URL}`)
  .then(console.log("Successfully connected to database"))
  .catch((err) => console.log(err));

usersRouter.post("/createAccount", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const existingUser = await UserModel.findOne({
      name: { $regex: new RegExp(name, "i") },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Name is already taken" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  const encrypted_password = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    name: name,
    password: encrypted_password,
  });

  try {
    await newUser.save();
    return res.status(200).json({ message: "Successfully created new user" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

usersRouter.post("/signIn", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const user = await UserModel.findOne({
      name: { $regex: new RegExp(name, "i") },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Inputted information was incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Inputted information was incorrect" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  return res.status(200).json({ message: "Authentication successful" });
});

usersRouter.get("/", (req, res) => {
  console.log("Received a request");
});

module.exports = usersRouter;
