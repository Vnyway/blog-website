import React, { useContext, useEffect, useState } from "react";
import { formattedDate } from "../functions";
import { Link, useParams } from "react-router-dom";
import DOMpurify from "dompurify";
import { UserContext } from "../contexts/UserContext";

const Post = () => {
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);
  const [post, setPost] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:4400/post/${id}`).then((res) => {
      res.json().then((post) => {
        setPost(post);
      });
    });
  }, []);

  let sanitizedContent;

  if (post) {
    sanitizedContent = DOMpurify.sanitize(post.content);
  }

  if (!post) {
    return <></>;
  }

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
            {userInfo.id === post.author._id && (
              <Link
                to={`/edit/${post._id}`}
                className="flex items-center gap-[5px] text-[22px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <span>Edit Post</span>
              </Link>
            )}
          </div>
          <img
            src={`http://localhost:4400/${post.cover}`}
            alt={post.title}
            className="w-full"
          />
          <div
            style={{ transition: "all ease-in-out .3s" }}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            className="description text-[#3B3C4A] flex flex-col items-start gap-[15px] md:gap-[32px] font-normal text-[20px] leading-[32px]"></div>
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
