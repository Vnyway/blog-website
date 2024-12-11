import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <main className="flex justify-center px-[20px]">
      <form
        className="flex flex-col gap-[20px] w-full md:w-[450px] my-[80px] p-[32px] rounded-[12px] shadow-md
          bg-[#FFFFFF]
        ">
        <h1 className="text-center font-semibold text-[26px] text-[#181A2A]">
          Register
        </h1>
        <input
          type="text"
          placeholder="Your Username"
          name="username"
          className="bg-[#FFFFFF] border-[#DCDDDF] border-[1px]  h-[48px] w-full px-[16px] py-[12px] font-normal text-[16px] text-paragraph leading-[24px] outline-category mb-[8px]"
        />
        <input
          type="password"
          placeholder="Your Password"
          name="password"
          className="bg-[#FFFFFF] border-[#DCDDDF] border-[1px]  h-[48px] w-full px-[16px] py-[12px] font-normal text-[16px] text-paragraph leading-[24px] outline-category mb-[8px]"
        />
        <div className="text-center font-normal text-[16px] text-customGray leading-[24px] pb-[8px] group">
          <Link to="/login">
            Do not have account?
            <span className="group-hover:text-[#181A2A] cursor-pointer">
              {" "}
              Login
            </span>
          </Link>
        </div>
        <button
          style={{ transition: "all ease-out .3s" }}
          className="px-[20px] py-[12px] rounded-[6px] border-[1px] border-[#4B6BFB] bg-[#4B6BFB] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#4B6BFB] font-medium text-[16px] leading-[24px]">
          Register
        </button>
      </form>
    </main>
  );
};

export default Register;
