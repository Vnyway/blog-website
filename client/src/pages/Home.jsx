import { useEffect, useState } from "react";
import { PinnedPost, Posts } from "../components";

const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4400/posts").then((res) => {
      res.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <main>
      {posts.length > 0 ? (
        <>
          <PinnedPost latestPost={posts[0]} />
          <Posts shownPosts={posts} />
        </>
      ) : (
        <></>
      )}
    </main>
  );
};

export default Home;
