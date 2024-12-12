import { useEffect, useState } from "react";
import { Posts } from "../components";
// import { posts } from "../constants";

const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4400/posts").then((res) => {
      res.json().then((posts) => {
        console.log(posts);
        setPosts(posts);
      });
    });
  }, []);
  return <main>{posts.length > 0 ? <Posts shownPosts={posts} /> : <></>}</main>;
};

export default Home;
