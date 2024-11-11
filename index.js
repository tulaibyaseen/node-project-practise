const express = require("express");
const app = express();
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const { error } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");

const PORT = 8000;
// connection
mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app-1")
  .then(() => console.log("Mongoose Connected"))
  .catch((err) => console.log("Mongo Error", err));

// console.log(users);

app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => console.log(`Server Started on port : ${PORT}`));
