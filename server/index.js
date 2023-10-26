const axios = require("axios");
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res, next) => {
  const date = new Date().toISOString().split("T")[0];
  const URL = "https://api.frontendexpert.io/api/fe/wordle-words";
  const resp = await axios(URL);
  const data = resp?.data || [];
  const random = data[Math.floor(Math.random() * data.length)];
  res.json({ solution: random });
});

app.listen(4444, () => {
  console.log("Running on port 4444");
});
