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
  const createPost = async (e) => {
    const data = new FormData();
    data.set("title", title);
    data.set("desc", desc);
    data.set("category", category);
    data.set("content", content);
    data.set("file", file);
    e.preventDefault();
    console.log(file);
    const res = await fetch("http://localhost:4400/post", {
      method: "POST",
      body: data,
    });
    if (res.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <section className="container mx-auto flex flex-col">
      <form
        className="flex flex-col gap-[20px] w-full p-[32px] rounded-[12px] shadow-md
          bg-[#FFFFFF]
          "
        onSubmit={createPost}>
        <h2>Create Post</h2>
        <input
          type="text"
          placeholder="Title"
          className={inputItem}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className={inputItem}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          className={inputItem}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
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
