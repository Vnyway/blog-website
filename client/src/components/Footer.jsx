import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Footer = () => {
  const { setCategory } = useContext(UserContext);
  return (
    <footer className="container mx-auto">
      <Link
        to="/"
        onClick={() => setCategory(null)}
        className="flex items-center gap-[10px] py-[40px] border-t-[1px] border-[#DCDDDF]">
        <img src="/images/layout/logo-image.png" alt="logo" />
        <div className="text-[#181A2A]">
          <h4 className="text-[20px] leading-[28px]">
            <span className="font-normal ">Meta</span>
            <span className="font-bold">Blog</span>
          </h4>
          <span className="font-light text-[16px]">
            Here you can share your thoughts
          </span>
        </div>
      </Link>
    </footer>
  );
};

export default Footer;
