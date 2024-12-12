import { Link } from "react-router-dom";
import { listItemLight } from "../styles";
import { links } from "../constants";
import { useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
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
          to="/"
          className="w-[158px] hover:scale-105 outline-none">
          <img src="/images/layout/logo.svg" alt="logo" />
        </Link>
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center gap-[30px]">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  style={{ transition: "all ease-out .3s" }}
                  to={link.path}
                  className={listItemLight}>
                  {link.name}
                </Link>
              </li>
            ))}
            {userInfo?.username ? (
              <>
                <Link
                  style={{ transition: "all ease-out .3s" }}
                  className={listItemLight}
                  to="/write">
                  {userInfo?.username}
                </Link>
                <button
                  style={{ transition: "all ease-out .3s" }}
                  className={listItemLight}
                  onClick={logout}>
                  Logout
                </button>
              </>
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
        <button className="pl-[15px] relative lg:hidden">
          {/* <BurgerMenu /> */}
        </button>
      </div>
    </header>
  );
};

export default Header;
