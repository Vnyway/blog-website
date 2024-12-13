import React, { useEffect, useState } from "react";
import { quillFormats, quillModules } from "../constants";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { formButton, inputItem } from "../styles";
import { Navigate, useParams } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    fetch(`http://localhost:4400/post/${id}`).then((res) => {
      res.json().then((post) => {
        setTitle(post.title);
        setDesc(post.desc);
        setContent(post.content);
        setCategory(post.category);
      });
    });
  }, []);
  const updatePost = async (e) => {
    const data = new FormData();
    data.set("title", title);
    data.set("desc", desc);
    data.set("category", category);
    data.set("content", content);
    data.set("id", id);
    if (files[0]) {
      data.set("file", files[0]);
    }
    e.preventDefault();
    const res = await fetch("http://localhost:4400/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (res.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }
  return (
    <section className="container mx-auto flex flex-col">
      <form
        className="flex flex-col gap-[20px] w-full p-[32px] rounded-[12px] shadow-md
            bg-[#FFFFFF]
            "
        onSubmit={updatePost}>
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
        <input type="file" onChange={(e) => setFiles(e.target.files)} />
        <ReactQuill
          theme="snow"
          value={content}
          onChange={(value) => setContent(value)}
          modules={quillModules}
          formats={quillFormats}
        />
        <button className={`${formButton} mt-[20px]`}>Update Post</button>
      </form>
    </section>
  );
};

export default Edit;
