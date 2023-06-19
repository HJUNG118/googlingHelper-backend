const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
require("dotenv").config();
const conn_str = process.env.mongoURI;
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

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
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const message = await deleteKeyWord(username, keyWord);
    res.status(200).json(message);
  } catch (error) {
    console.error("Atlas 및 데이터 삭제 오류:", error);
    res.status(500).json("오류");
  }
});

module.exports = router;
