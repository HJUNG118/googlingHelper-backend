const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenBlacklist = require("./tokenBlacklist");

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    if (tokenBlacklist.isTokenBlacklisted(token)) {
      return res
        .status(401)
        .json({ msg: "Token is blacklisted, Please login again" });
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
