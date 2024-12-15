import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    if (!username || username.length < 3 || username.length > 30)
      newErrors.username = "Username must be between 3 and 30 characters.";
    if (!password || password.length < 4)
      newErrors.password = "Password must be longer than 4 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData();
    data.set("username", username);
    data.set("file", file);
    data.set("password", password);

    const res = await fetch("http://localhost:4400/register", {
      method: "POST",
      body: data,
    });
    if (res.ok) {
      setRedirect(true);
    } else {
      setErrors({ userExists: "Such user already exists" });
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="flex justify-center px-[20px]">
      <form
        onSubmit={register}
        className="flex flex-col gap-[20px] w-full md:w-[450px] my-[80px] p-[32px] rounded-[12px] shadow-md bg-[#FFFFFF]">
        <h1 className="text-center font-semibold text-[26px] text-[#181A2A]">
          Register
        </h1>
        {errors?.username && (
          <p className="text-red-500 text-sm">{errors?.username}</p>
        )}
        <input
          type="text"
          placeholder="Your Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`bg-[#FFFFFF] border-[1px] h-[48px] w-full px-[16px] py-[12px] mb-[8px] ${
            errors.username ? "border-red-500" : "border-[#DCDDDF]"
          }`}
        />
        {errors?.password && (
          <p className="text-red-500 text-sm">{errors?.password}</p>
        )}
        <input
          type="password"
          placeholder="Your Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`bg-[#FFFFFF] border-[1px] h-[48px] w-full px-[16px] py-[12px] mb-[8px] ${
            errors.password ? "border-red-500" : "border-[#DCDDDF]"
          }`}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <div className="text-center font-normal text-[16px] text-customGray leading-[24px] pb-[8px] group">
          <Link to="/login">
            Do not have account?
            <span className="group-hover:text-[#181A2A] cursor-pointer">
              {" "}
              Login
            </span>
          </Link>
        </div>
        {errors?.userExists && (
          <p className="text-red-500 text-md text-center">
            {errors?.userExists}
          </p>
        )}
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
