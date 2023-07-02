const express = require("express");
const router = express.Router();

const { extractUserName } = require("../../function/extractUserName");
const { checkKeyword } = require("../../function/checkKeyword");

router.post("/", async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  let userToken = null;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
  }

  const username = await extractUserName(userToken);
  try {
    const dataToSend = await checkKeyword(username);

    if (dataToSend.length === 0) {
      res.status(200).json({ message: "데이터가 없습니다." });
    } else {
      res.status(200).json({ dataToSend, username });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "스크랩 데이터 전송 오류" });
  }
});

module.exports = router;
