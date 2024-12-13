import React, { useEffect, useState } from "react";
import { formattedDate } from "../functions";
import { Link, useParams } from "react-router-dom";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:4400/post/${id}`).then((res) => {
      res.json().then((post) => {
        setPost(post);
      });
    });
  }, []);
  return (
    <main className="pb-[20px] md:pb-[30px]">
      {post && (
        <div className="container mx-auto py-[15px] md:py-[30px] flex flex-col items-start gap-[32px]">
          <div className="flex flex-col items-start gap-[10px] md:gap-[20px]">
            <Link
              to={`/?cat=${post.category}`}
              className="px-[12px] py-[6px] bg-category rounded-[6px] text-white font-medium text-[14px]">
              {post.category}
            </Link>
            <h1 className="text-[#181A2A] font-semibold text-[28px] md:text-[36px]">
              {post.title}
            </h1>
            <Link
              to={`/blogger/${post.author._id}`}
              className="flex gap-[20px] items-center text-customGray">
              <div className="flex items-center gap-[12px]">
                <img
                  src={post.userImg || "/images/bloggers/default.svg"}
                  alt={post.username}
                />
                <span>{post.username}</span>
              </div>
              <span>{formattedDate(post.createdAt)}</span>
            </Link>
          </div>
          <img
            src={`http://localhost:4400/${post.cover}`}
            alt={post.title}
            className="w-full"
          />
          <div className="w-full flex flex-col gap-[20px]">
            <h3 className="text-[#181A2A] font-semibold text-[24px]">
              Comments
            </h3>
            {/* Later */}
          </div>
        </div>
      )}
    </main>
  );
};

export default Post;
