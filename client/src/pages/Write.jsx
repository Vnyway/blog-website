import React, { useState } from "react";
import { quillFormats, quillModules } from "../constants";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { formButton, inputItem } from "../styles";
import { Navigate } from "react-router-dom";

const Write = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    if (!title || title.length < 4 || title.length > 50) {
      newErrors.title =
        "Title is required and must be between 4 and 50 characters.";
    }
    if (!desc || desc.length < 20 || desc.length > 100) {
      newErrors.desc =
        "Description is required and must be between 20 and 100 characters.";
    }
    if (!category || category.length < 4 || category.length > 50) {
      newErrors.category =
        "Category is required and must be between 4 and 50 characters.";
    }
    if (!content || content.length < 100) {
      newErrors.content =
        "Content is required and must be at least 100 characters.";
    }
    if (!file) {
      newErrors.file = "File is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData();
    data.set("title", title);
    data.set("desc", desc);
    data.set("category", category);
    data.set("content", content);
    data.set("file", file);

    const res = await fetch(process.env.REACT_APP_ORIGIN + "/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (res.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <section className="container mx-auto flex flex-col py-[70px]">
      <form
        className="flex flex-col gap-[20px] w-full p-[32px] rounded-[12px] shadow-md bg-[#FFFFFF]"
        onSubmit={createPost}>
        <h2 className="text-2xl font-semibold">Create Post</h2>

        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        <input
          type="text"
          placeholder="Title"
          className={`${inputItem} ${errors.title ? "border-red-500" : ""}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {errors.desc && <p className="text-red-500 text-sm">{errors.desc}</p>}
        <input
          type="text"
          placeholder="Description"
          className={`${inputItem} ${errors.desc ? "border-red-500" : ""}`}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category}</p>
        )}
        <input
          type="text"
          placeholder="Category"
          className={`${inputItem} ${errors.category ? "border-red-500" : ""}`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className={`${errors.file ? "border-red-500" : ""}`}
        />

        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content}</p>
        )}
        <ReactQuill
          theme="snow"
          value={content}
          onChange={(value) => setContent(value)}
          modules={quillModules}
          formats={quillFormats}
        />

        <button className={`${formButton} mt-[20px]`}>Create Post</button>
      </form>
    </section>
  );
};

export default Write;
