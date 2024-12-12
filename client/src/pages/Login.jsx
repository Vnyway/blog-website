import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { formButton, inputItem } from "../styles";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const login = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4400/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (res.ok) {
      res.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("Wrong password");
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <main className="flex justify-center px-[20px]">
      <form
        onSubmit={login}
        className="flex flex-col gap-[20px] w-full md:w-[450px] my-[80px] p-[32px] rounded-[12px] shadow-md
          bg-[#FFFFFF]
        ">
        <h1 className="text-center font-semibold text-[26px] text-[#181A2A]">
          Login
        </h1>
        <input
          type="text"
          placeholder="Your Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputItem}
        />
        <input
          type="password"
          placeholder="Your Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputItem}
        />
        <div className="text-center font-normal text-[16px] text-customGray leading-[24px] pb-[8px] group">
          <Link to="/register">
            Do not have account?
            <span className="group-hover:text-[#181A2A] cursor-pointer">
              {" "}
              Register
            </span>
          </Link>
        </div>
        <button className={formButton}>Login</button>
      </form>
    </main>
  );
};

export default Login;
