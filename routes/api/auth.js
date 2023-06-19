const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  res.send("로그인된 유저가 요청한 응답");
});

module.exports = router;
