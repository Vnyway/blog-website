import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserModel from "./models/User.js";
import PostModel from "./models/Post.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const uploadMiddleware = multer({ dest: "uploads/" });

const salt = bcrypt.genSaltSync(10);

dotenv.config();
const app = express();
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

app.post("/register", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { username, password } = req.body;
  try {
    const userDoc = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, salt),
      image: newPath ? newPath : null,
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

// app.post("/register", uploadMiddleware.single("file"), async (req, res) => {
//   let imagePath = null;

//   if (req.file) {
//     const { originalname, buffer, mimetype } = req.file; // Using multer's memory storage
//     const parts = originalname.split(".");
//     const ext = parts[parts.length - 1];
//     const fileKey = `users/${uuidv4()}.${ext}`; // Generate unique file name

//     const uploadParams = {
//       Bucket: process.env.BUCKET_NAME, // Your S3 bucket name
//       Key: fileKey,                   // File path and name in S3
//       Body: buffer,                   // File buffer
//       ContentType: mimetype,          // File MIME type
//     };

//     try {
//       await s3.send(new PutObjectCommand(uploadParams)); // Upload to S3
//       imagePath = fileKey; // Store the file path in S3
//     } catch (error) {
//       console.error("Error uploading to S3:", error);
//       return res.status(500).json("Failed to upload image");
//     }
//   }

//   const { username, password } = req.body;

//   try {
//     const userDoc = await UserModel.create({
//       username,
//       password: bcrypt.hashSync(password, salt),
//       image: imagePath ? imagePath : null, // Store S3 image path in the database
//     });
//     res.json(userDoc);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await UserModel.findOne({ username });
  const passwordCorrect = bcrypt.compareSync(password, userDoc.password);
  if (passwordCorrect) {
    jwt.sign(
      { username, id: userDoc._id, image: userDoc.image },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token)
          .json({ id: userDoc._id, username, image: userDoc.image });
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

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { title, desc, category, content } = req.body;
    const postDoc = await PostModel.create({
      title,
      desc,
      category,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { title, desc, category, content, id } = req.body;
    const postDoc = await PostModel.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("That's not your post");
    }
    postDoc.title = title;
    postDoc.desc = desc;
    postDoc.category = category;
    postDoc.content = content;
    postDoc.cover = newPath ? newPath : postDoc.cover;
    await postDoc.save();
    res.json({ postDoc });
  });
});

app.get("/posts", async (req, res) => {
  const cat = req.query.cat;
  const filter = cat ? { category: cat } : {};
  const posts = await PostModel.find(filter)
    .populate("author", ["username", "image"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = await PostModel.findById(id).populate("author", [
    "username",
    "image",
  ]);
  res.json(post);
});

app.listen(4400);
