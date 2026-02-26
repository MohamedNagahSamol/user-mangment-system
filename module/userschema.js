const monogo = require("mongoose");

const Schema = monogo.Schema;

const bcrypt = require("bcrypt");
const { type } = require("node:os");

const UserSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    permissions: {
      type: [],
      default: [],
    },
    image:String,
    resetToken:String,
    resetTokenExpire:Date,
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const AuthUser = monogo.model("User", UserSchema);
module.exports = AuthUser;
