import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Posts } from "../buckets/s3clientPosts.js";
import { s3Bloggers } from "../buckets/s3clientBloggers.js";
import PostModel from "../models/Post.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() });
const bucketName1 = process.env.BUCKET_NAME1;
const bucketName = process.env.BUCKET_NAME;

router.post("/post", uploadMiddleware.single("file"), async (req, res) => {
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

router.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
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

router.get("/posts", async (req, res) => {
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

router.get("/post/:id", async (req, res) => {
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

export default router;
