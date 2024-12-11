import { Link } from "react-router-dom";
import { listItemLight } from "../styles";
import { links } from "../constants";

const Header = () => {
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
            <li>
              <Link
                style={{ transition: "all ease-out .3s" }}
                className={listItemLight}
                to="/login">
                Login
              </Link>
            </li>
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
