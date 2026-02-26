const jwt = require("jsonwebtoken");
const AuthUser = require("../module/userschema");
const { env } = require("node:process");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await AuthUser.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    req.user = user;

    next();
  } catch (err) {
    //// console.log(err)
    res.status(401).json({ message: "Invalid token" });
  }
};

const allow_roles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denid" });
    }
    next();
  };
};

const allow_permission = (perms) => {
  return (req, res, next) => {
    const hasPermission = req.user.permissions.includes(perms);
    if (!hasPermission) {
      return res.status(403).json({ message: "permission denid" });
    }
    next();
  };
};

const checkIfUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, async (err, decoded) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const loginUser = await AuthUser.findById(decoded.id);

        res.locals.user = loginUser;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkIfUser, allow_roles, allow_permission };
