import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { formattedDate } from "../functions";
import { UserContext } from "../contexts/UserContext";

const Posts = ({ shownPosts }) => {
  const { setCategory } = useContext(UserContext);
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
                  src={post.cover}
                  alt="image"
                />
              </Link>
              <Link
                onClick={() => setCategory(post.category)}
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
              </Link>
              <Link to={`/?uid=${post.author._id}`} className="w-full">
                <div className="flex w-full justify-between items-center text-customGray">
                  <div className="flex items-center gap-[12px]">
                    <img
                      className={
                        post.author.image
                          ? "size-[40px] rounded-full"
                          : "size-[40px]"
                      }
                      src={
                        post.author.image
                          ? post.author.image
                          : "/images/layout/user.png"
                      }
                      alt={post.author.username}
                    />
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
