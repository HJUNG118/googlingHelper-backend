const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const tokenBlacklist = require("../../middleware/tokenBlacklist");

router.get("/", authMiddleware, (req, res) => {
  const token = req.header("x-auth-token");
  tokenBlacklist.addToBlacklist(token);

  return res.send("로그아웃 완료");
});

module.exports = router;
