import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Bloggers } from "../buckets/s3clientBloggers.js";
import UserModel from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() });
const salt = bcrypt.genSaltSync(10);
const bucketName = process.env.BUCKET_NAME;

router.post("/register", uploadMiddleware.single("file"), async (req, res) => {
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

router.post("/login", async (req, res) => {
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

router.get("/profile", async (req, res) => {
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

router.post("/logout", (req, res) => {
  res.cookie("token", "").json("OK");
});

export default router;
