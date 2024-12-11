import expresss from "express";

const app = expresss();

app.get("/", (req, res) => {
  res.json("OK");
});

app.listen(4400);
