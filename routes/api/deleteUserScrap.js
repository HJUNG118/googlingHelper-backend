const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const conn_str = process.env.mongoURI;
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { extractUserName} = require("../../function/extractUserName");
const { deleteUserScrap } = require("../../function/deleteUserScrap");

router.delete('/', async (req, res) => {
  const { url, title, date } = req.body;
  try {
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const username = await extractUserName(userToken, process.env.jwtSecret);
    const message = await deleteUserScrap(username, url, title, date, res);
    res.status(200).json(message);
  } catch (error) {
    console.error('Atlas 및 데이터 삭제 오류:', error);
    res.status(500).json('오류');
  }
});

module.exports = router;