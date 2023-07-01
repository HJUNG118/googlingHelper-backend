const express = require("express");
const router = express.Router();
require("dotenv").config();
const { client } = require("../../config/mongodb");

const { deleteKeyWord } = require("../../function/deleteKeyWord");
const { extractUserName } = require("../../function/extractUserName");

router.delete("/", async (req, res) => {
  try {
    const { keyWord } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const username = await extractUserName(userToken);
    const message = await deleteKeyWord(username, keyWord);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json(message);
  }
});

module.exports = router;
