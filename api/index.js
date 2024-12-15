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
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Bloggers } from "./buckets/s3clientBloggers.js";
import { s3Posts } from "./buckets/s3clientPosts.js";

const uploadMiddleware = multer({ storage: multer.memoryStorage() });

const salt = bcrypt.genSaltSync(10);

const bucketName = process.env.BUCKET_NAME;
const bucketName1 = process.env.BUCKET_NAME1;

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
  let imagePath = null;

  if (req.file) {
    const { originalname, buffer, mimetype } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const fileKey = `users/${uuidv4()}.${ext}`;

    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      await s3Bloggers.send(new PutObjectCommand(uploadParams));
      imagePath = fileKey;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      return res.status(500).json("Failed to upload image");
    }
  }

  const { username, password } = req.body;

  try {
    const userDoc = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, salt),
      image: imagePath ? imagePath : null,
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      return res.status(404).json("User not found");
    }

    const passwordCorrect = bcrypt.compareSync(password, userDoc.password);
    if (!passwordCorrect) {
      return res.status(400).json("Wrong password");
    }

    let imageUrl = null;

    if (userDoc.image) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: userDoc.image,
      };

      const command = new GetObjectCommand(getObjectParams);
      imageUrl = await getSignedUrl(s3Bloggers, command, { expiresIn: 3600 });
    }

    jwt.sign(
      { username, id: userDoc._id, image: imageUrl },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token)
          .json({ id: userDoc._id, username, image: imageUrl });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong");
  }
});

app.get("/profile", async (req, res) => {
  const { token } = req.cookies;

  try {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) return res.status(401).json("Unauthorized");

      let imageUrl = null;

      const userDoc = await UserModel.findById(info.id);
      if (userDoc.image) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: userDoc.image,
        };

        const command = new GetObjectCommand(getObjectParams);
        imageUrl = await getSignedUrl(s3Bloggers, command, { expiresIn: 3600 });
      }

      res.json({ ...info, image: imageUrl });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("OK");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  let imagePath = null;
  if (req.file) {
    const { originalname, buffer, mimetype } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const fileKey = `posts/${uuidv4()}.${ext}`;

    const uploadParams = {
      Bucket: process.env.BUCKET_NAME1,
      Key: fileKey,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      await s3Posts.send(new PutObjectCommand(uploadParams));
      imagePath = fileKey;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      return res.status(500).json("Failed to upload image");
    }
  }

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { title, desc, category, content } = req.body;
    const postDoc = await PostModel.create({
      title,
      desc,
      category,
      content,
      cover: imagePath ? imagePath : null,
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

  try {
    const posts = await PostModel.find(filter)
      .populate("author", ["username", "image"])
      .sort({ createdAt: -1 });

    for (const post of posts) {
      if (post.cover) {
        const getObjectParams = {
          Bucket: bucketName1,
          Key: post.cover,
        };

        const command = new GetObjectCommand(getObjectParams);
        const imageUrl = await getSignedUrl(s3Posts, command, {
          expiresIn: 3600,
        });

        post.cover = imageUrl;
      }

      if (post.author.image) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: post.author.image,
        };

        const command = new GetObjectCommand(getObjectParams);
        const imageUrl = await getSignedUrl(s3Bloggers, command, {
          expiresIn: 3600,
        });

        post.author.image = imageUrl;
      }
    }

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await PostModel.findById(id).populate("author", [
    "username",
    "image",
  ]);

  if (postDoc.cover) {
    let imageUrl = null;
    const getObjectParams = {
      Bucket: bucketName1,
      Key: postDoc.cover,
    };

    const command = new GetObjectCommand(getObjectParams);
    imageUrl = await getSignedUrl(s3Posts, command, { expiresIn: 3600 });

    postDoc.cover = imageUrl;
  }

  if (postDoc.author.image) {
    let imageUrl = null;
    const getObjectParams = {
      Bucket: bucketName,
      Key: postDoc.author.image,
    };

    const command = new GetObjectCommand(getObjectParams);
    imageUrl = await getSignedUrl(s3Bloggers, command, { expiresIn: 3600 });

    postDoc.author.image = imageUrl;
  }

  res.json(postDoc);
});

app.listen(4400);
