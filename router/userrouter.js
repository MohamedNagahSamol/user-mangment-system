const userController = require("../controller/usercontroller");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const mioddleware = require("../middleware/middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number",
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  userController.post_signup,
);
router.post("/login", userController.post_login);
router.post(
  "/changepassword",
  mioddleware.requireAuth,
  mioddleware.allow_permission("change_password"),
  userController.update_password,
);
router.post(
  "/changeimage",
  mioddleware.requireAuth,
  upload.single("image"),
  userController.change_imge,
);
router.get(
  "/profile",
  mioddleware.requireAuth,
  mioddleware.allow_roles(["user", "admin"]),
  userController.profile,
);
router.post(
  "/forgetpassword",
  mioddleware.requireAuth,
  userController.forget_Password,
);
router.post(
  "/resetpassword/:token",
  userController.reset_password,
);
module.exports = router;
