import { useContext, useEffect, useState } from "react";
import { PinnedPost, Posts } from "../components";
import { UserContext } from "../contexts/UserContext";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { category } = useContext(UserContext);
  useEffect(() => {
    if (!category) {
      fetch("http://localhost:4400/posts").then((res) => {
        res.json().then((posts) => {
          setPosts(posts);
        });
      });
    } else {
      fetch(`http://localhost:4400/posts?cat=${category}`).then((res) => {
        res.json().then((posts) => {
          setPosts(posts);
        });
      });
    }
  }, [category]);
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
