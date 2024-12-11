import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  res.json({ requestData: { username, password } });
});

app.listen(4400);
