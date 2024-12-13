import React from "react";
import { Link } from "react-router-dom";
import { formattedDate } from "../functions";

const Posts = ({ shownPosts }) => {
  return (
    <section>
      <div className="container mx-auto flex flex-col py-[40px] md:py-[80px]">
        <h4 className="font-bold text-[24px] leading-[28px] mb-[32px] text-[#181A2A]">
          Latest Posts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {shownPosts.map((post) => (
            <div
              key={post._id}
              className="border-[#E8E8EA] rounded-[12px] border-[1px] p-[16px] flex flex-col gap-[16px] items-start hover:shadow-lg">
              <Link
                to={`/post/${post._id}`}
                className="w-full h-[240px] rounded-[6px]">
                <img
                  className="w-full h-[240px] rounded-[6px]"
                  src={`http://localhost:4400/${post.cover}`}
                  alt="image"
                />
              </Link>
              <Link
                to={`/?cat=${post.category}`}
                className="bg-category bg-opacity-10 rounded-[6px] px-[10px] py-[4px] text-category">
                {post.category}
              </Link>
              <Link to={`/post/${post._id}`}>
                <h3
                  className="text-[#181A2A]
                   font-semibold text-[24px] leading-[28px] line-clamp-2 h-[62px]">
                  {post.title}
                </h3>
                <p>{post.desc}</p>
              </Link>
              <Link to={`/blogger/${post.username}`}>
                <div className="flex gap-[20px] items-center text-customGray">
                  <div className="flex items-center gap-[12px]">
                    {/* <img
                      src={post.userImg}
                      alt={post.username}
                      className="size-[36px] rounded-full"
                    /> */}
                    <span>{post.author.username}</span>
                  </div>
                  <span>{formattedDate(post.createdAt)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Posts;
