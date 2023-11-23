const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { connection } = require("./config/db");
const { UserModel } = require("./models/User.model");
const { tweetRouter } = require("./routes/tweet.routes");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Fullstack Twitter App!" });
});

//register
app.post("/register", async (req, res) => {
  const { name, email, password, gender, country } = req.body;
  //if already registered
  const is_User = await UserModel.findOne({ email: email });
  if (is_User) {
    return res.json({
      message: "User already registered! Try Logging in again.",
    });
  }
  //hashing the password
  bcrypt.hash(password, 8, async function (err, hash) {
    await UserModel.create({ name, email, password: hash, gender, country });
  });
  res.json({ message: "SignUp Successful" });
});

//logging in
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //compare the password
  const is_User = await UserModel.findOne({ email });

  if (is_User) {
    const hashed_password = is_User.password;
    bcrypt.compare(password, hashed_password, function (err, result) {
      // result == true
      if (result) {
        const token = jwt.sign({ userID: is_User._id }, "shhhhh");
        return res.json({ message: "Login Successful", token: token });
      } else {
        return res.json({ message: "Login Failed? Invalid Crediantials" });
      }
    });
  }
});

app.use("/tweet", tweetRouter);

app.listen(8000, async (req, res) => {
  try {
    await connection;
    console.log("Connection established to Database");
  } catch (error) {
    console.log("Error connecting to Database");
    console.log(error);
  }
  console.log("listening on port 8000");
});
