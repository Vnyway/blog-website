export const links = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "Blogger", path: "/blogger/1" },
  { id: 3, name: "Single Post", path: "/singlePost/1" },
  { id: 5, name: "Write", path: "/write" },
];

export const posts = [
  {
    id: 1,
    title: "The Rise of Artificial Intelligence",
    postImg: "/images/posts/post1.svg",
    date: new Date("2024-07-16"),
    username: "Tracey Wilson",
    userImg: "./images/bloggers/blogger1.svg",
    category: "Technology",
  },
  {
    id: 2,
    title: "Embracing Minimalism",
    postImg: "/images/posts/post2.svg",
    date: new Date("2024-05-20"),
    username: "Jason Francisco",
    userImg: "/images/bloggers/blogger2.svg",
    category: "Lifestyle",
  },
  {
    id: 3,
    title: "Strategies for Small Business Growth",
    postImg: "./images/posts/post3.svg",
    date: new Date("2024-06-30"),
    username: "Elizabeth Slavin",
    userImg: "/images/bloggers/blogger3.svg",
    category: "Business",
  },
  {
    id: 4,
    title: "The Impact of Globalization on Local Economies",
    postImg: "/images/posts/post4.svg",
    date: new Date("2024-07-22"),
    username: "Ernie Smith",
    userImg: "/images/bloggers/blogger4.svg",
    category: "Economy",
  },
  {
    id: 5,
    title: "Top Destinations for Solo Travelers",
    postImg: "/images/posts/post5.svg",
    date: new Date("2024-04-12"),
    username: "Eric Smith",
    userImg: "/images/bloggers/blogger5.svg",
    category: "Travel",
  },
  {
    id: 6,
    title: "Healthy Living Tips for a Balanced Life",
    postImg: "/images/posts/post6.svg",
    date: new Date("2024-05-10"),
    username: "Tracey Wilson",
    userImg: "/images/bloggers/blogger1.svg",
    category: "Lifestyle",
  },
  {
    id: 7,
    title: "Cybersecurity in the Digital Age",
    postImg: "/images/posts/post7.svg",
    date: new Date("2024-03-23"),
    username: "Jason Francisco",
    userImg: "/images/bloggers/blogger2.svg",
    category: "Technology",
  },
  {
    id: 8,
    title: "The Evolution of Extreme Sports",
    postImg: "/images/posts/post8.svg",
    date: new Date("2024-04-25"),
    username: "Elizabeth Slavin",
    userImg: "/images/bloggers/blogger3.svg",
    category: "Sports",
  },
  {
    id: 9,
    title: "Exploring the Beauty of the Swiss Alps",
    postImg: "/images/posts/post9.svg",
    date: new Date("2024-06-04"),
    username: "Ernie Smith",
    userImg: "/images/bloggers/blogger4.svg",
    category: "Travel",
  },
];

export const categories = [
  { id: 1, cat: "Lifestyle" },
  { id: 2, cat: "Technology" },
  { id: 3, cat: "Travel" },
  { id: 4, cat: "Business" },
  { id: 5, cat: "Economy" },
  { id: 6, cat: "Sports" },
];

export const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

export const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];
