import { Link } from "react-router-dom";
import { listItemLight } from "../styles";
import { links } from "../constants";
import { useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Header = () => {
  const { userInfo, setUserInfo, setCategory } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4400/profile", {
      credentials: "include",
    }).then((res) => {
      res.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const logout = () => {
    fetch("http://localhost:4400/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  };

  return (
    <header>
      <div className="container mx-auto h-[100px] flex justify-between items-center">
        <Link
          style={{ transition: "all ease-out .3s" }}
          onClick={() => setCategory(null)}
          to="/"
          className="w-[158px] hover:scale-105 outline-none">
          <img src="/images/layout/logo.svg" alt="logo" />
        </Link>
        <nav className="flex items-center">
          <ul className="flex items-center gap-[30px]">
            {userInfo?.username ? (
              <li className="flex items-center gap-[30px]">
                <Link
                  style={{ transition: "all ease-out .3s" }}
                  className="flex items-center gap-[10px] group"
                  to="/write">
                  <img
                    className={
                      userInfo?.image
                        ? "size-[40px] rounded-full"
                        : "size-[30px]"
                    }
                    src={
                      userInfo?.image
                        ? `http://localhost:4400/${userInfo?.image}`
                        : "/images/layout/user.png"
                    }
                    alt={userInfo?.username}
                  />
                  <span className="font-[500] text-[#696A75] group-hover:text-[#181A2A] transition-all ease-out duration-300 text-[18px]">
                    Create Post
                  </span>
                </Link>
                <button
                  style={{ transition: "all ease-out .3s" }}
                  className={listItemLight}
                  onClick={logout}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    style={{ transition: "all ease-out .3s" }}
                    className={listItemLight}
                    to="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    style={{ transition: "all ease-out .3s" }}
                    className={listItemLight}
                    to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
