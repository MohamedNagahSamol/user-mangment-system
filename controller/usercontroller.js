const AuthUser = require("../module/userschema");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const moment = require("moment");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
const nodemalier = require("nodemailer");
const transporter = nodemalier.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.password,
  },
});
const post_signup = async (req, res) => {
  try {
    const objError = validationResult(req);
    if (objError.errors.length > 0) {
      return res.json({ arrValidationError: objError.errors });
    }
    const isEmailExist = await AuthUser.findOne({ email: req.body.email });
    if (isEmailExist) {
      return res.json({ existEmail: "Email already exist" });
    }
    const newUser = await AuthUser.create(req.body);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
    res.json({ id: newUser._id });
  } catch (err) {
    console.log(err);
  }
};
const profile = async (req, res) => {
  const User = await AuthUser.findById(req.user._id);
  const objUser = {
    username: User.username,
    email: User.email,
    createdAt: moment(User.createdAt).fromNow(),
    updatedAt: moment(User.updatedAt).fromNow(),
    role: User.role,
    image: User.image,
  };
  res.send(objUser);
};
const post_login = async (req, res) => {
  try {
    const loginUser = await AuthUser.findOne({ email: req.body.email });
    if (loginUser == null) {
      res.send("Email not found");
    } else {
      const match = await bcrypt.compare(req.body.password, loginUser.password);
      if (match) {
        const token = jwt.sign(
          { id: loginUser._id },
          process.env.JWT_SECRET_KEY,
        );
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json({ id: loginUser._id });
      } else {
        res.send("incorrect password");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const update_password = async (req, res) => {
  try {
    const loginUser = await AuthUser.findOne({ email: req.body.email });
    if (loginUser == null) {
      res.send("Email not found");
    } else {
      const match = await bcrypt.compare(
        req.body.OldPassword,
        loginUser.password,
      );
      if (match) {
        const hashpassword = await bcrypt.hash(req.body.NewPassword, 10);
        await AuthUser.updateOne(
          { _id: loginUser._id },
          { $set: { password: hashpassword } },
        );
        const token = jwt.sign(
          { id: loginUser._id },
          process.env.JWT_SECRET_KEY,
        );
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.send("updated password");
      } else {
        res.send("Old Password is not correct");
      }
    }
  } catch (err) {
    console.log(err);
  }
};
const change_imge = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "no file upload" });
  }
  ////  console.log(req.file)
  const imge = await cloudinary.uploader.upload(req.file.path);
  //// console.log(imge.secure_url);
  await AuthUser.updateOne(
    { _id: req.user._id },
    { $set: { image: imge.secure_url } },
  );
  res.status(200).json({ message: "file uploaded" });
};

const forget_Password = async (req, res) => {
  const User = await AuthUser.findOne({ email: req.body.email });
  if (!User) {
    return res.json({ message: "user not found" });
  }
  const token = crypto.randomBytes(32).toString("hex");
  User.resetToken = token;
  User.resetTokenExpire = Date.now() + 1000 * 60 * 10;
  await User.save();
  const link = "http://localhost:3002/resetpassword/" + token;

  try {
    await transporter.sendMail({
      to: User.email,
      subject: "password reset ",
      html: `a herf="${link}">Reaet password</a>`,
    });
    res.send("send link to gmail");
  } catch (err) {
    res.send("error in send");
  }
};
const reset_password = async (req, res) => {
  const User = await AuthUser.findOne({
    resetToken: req.params.token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!User) {
    return res.json({ message: "token invalid or expire" });
  }
  console.log(req.body.password);
  const hash = await bcrypt.hash(req.body.password, 10);
  User.password = hash;
  User.resetToken = undefined;
  User.resetTokenExpire = undefined;
  await User.save();
  res.json({ message: "password updated" });
};
module.exports = {
  post_signup,
  post_login,
  update_password,
  profile,
  change_imge,
  forget_Password,
  reset_password,
};
