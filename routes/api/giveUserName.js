const express = require("express");
const router = express.Router();
require("dotenv").config();

const { extractUserName } = require("../../function/extractUserName");

router.post("/", async (req, res) => {
  try {
    // const { userToken } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const username = await extractUserName(userToken);
    res.json({ username });
  } catch (error) {
    console.log(error);
    res.status(500).json("이름을 추출하지 못했습니다.");
  }
});

module.exports = router;
