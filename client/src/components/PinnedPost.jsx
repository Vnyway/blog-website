import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { formattedDate } from "../functions";
import { UserContext } from "../contexts/UserContext";

const PinnedPost = ({ latestPost }) => {
  const { setCategory } = useContext(UserContext);
  return (
    <section className="container mx-auto relative h-[300px] md:h-[435px] lg:h-[650px]">
      <div className="h-[200px] md:h-[400px] lg:h-[600px] rounded-[12px] relative">
        <img
          src={latestPost.cover}
          className="absolute top-0 left-0 w-full h-full rounded-[12px]"
          alt={latestPost.title}
        />
        <div
          style={{ transition: "all ease-in-out .3s" }}
          className={`absolute bottom-0 left-[10%] w-[80%] md:w-[60%] lg:w-[40%] p-[20px] md:p-[40px] rounded-[12px] bg-[#FFFFFF] text-[#181A2A] shadow-lg flex flex-col items-start gap-[10px] md:gap-[24px]`}>
          <Link
            onClick={() => setCategory(latestPost.category)}
            to={`/?cat=${latestPost.category}`}
            className="px-[10px] py-[4px] bg-category rounded-[6px] text-white font-medium text-[14px]">
            {latestPost.category}
          </Link>
          <Link to={`/post/${latestPost._id}`}>
            <h1 className="font-semibold text-[28px] md:text-[36px]">
              {latestPost.title}
            </h1>
          </Link>
          <Link to={`/?uid=${latestPost.author._id}`}>
            <div className="flex flex-col md:flex-row gap-[10px] md:gap-[24px] md:items-center text-paragraph font-medium text-[16px]">
              <div className="flex gap-[10px] items-center">
                <img
                  src={
                    latestPost.author.image
                      ? latestPost.author.image
                      : "/images/layout/user.svg"
                  }
                  alt="user"
                  className="size-[36px] rounded-full"
                />
                <span>{latestPost.author.username}</span>
              </div>
              <span>{formattedDate(latestPost.createdAt)}</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PinnedPost;
