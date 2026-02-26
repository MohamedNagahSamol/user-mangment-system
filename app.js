const express = require("express");
const app = express();

require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cloudinary = require("cloudinary").v2;
const nodemalier = require("nodemailer");

cloudinary.config({
  cloud_name: process.env.cloud_Name,
  api_key: process.env.API_key,
  api_secret: process.env.API_secret,
});
var jwt = require("jsonwebtoken");

const { check, validationResult } = require("express-validator");
var cookieParser = require("cookie-parser");
app.use(cookieParser());
const userRouter = require("./router/userrouter");
app.use(userRouter);
const mongo = require("mongoose");

const bcrypt = require("bcrypt");

app.get("/", (req, res) => {
  res.send("hello");
});

mongo
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connection"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT);
