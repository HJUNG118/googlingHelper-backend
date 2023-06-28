const express = require("express");
const router = express.Router();
require("dotenv").config();

const { extractUserName } = require("../../function/extractUserName");
const { deleteTitle } = require("../../function/deleteTitle");

router.delete("/", async (req, res) => {
  const { url, title, date } = req.body;
  try {
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
    }
    const username = await extractUserName(userToken);
    const message = await deleteTitle(username, url, title, date, res);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json(message);
  }
});

module.exports = router;
