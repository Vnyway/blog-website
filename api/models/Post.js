import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, min: 4, max: 50 },
    desc: { type: String, required: true, min: 20, max: 100 },
    category: { type: String, required: true },
    content: { type: String, required: true, min: 100 },
    cover: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const PostModel = model("Post", PostSchema);

export default PostModel;
