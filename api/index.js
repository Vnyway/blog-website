import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserModel from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const salt = bcrypt.genSaltSync(10);

dotenv.config();
const app = express();
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await UserModel.findOne({ username });
  const passwordCorrect = bcrypt.compareSync(password, userDoc.password);
  if (passwordCorrect) {
    jwt.sign(
      { username, id: userDoc._id },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({ id: userDoc._id, username });
      }
    );
  } else {
    res.status(400).json("Wrong password");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("OK");
});

app.listen(4400);
