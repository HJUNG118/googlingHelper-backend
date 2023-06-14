const express = require("express");
// (1) bcryptjs 모듈 가져오기
const bcrypt = require("bcryptjs");
// (2) User 변수에 경로에 있는 사용자 모델 가져오기
// → 이 모델은 DB 에서 사용자 정보를 조작하는 데 사용됨
const User = require("../../models/user");
const router = express.Router();
// (3) JWT 생성, 검증에 사용되는 jwt 모듈
const jwt = require("jsonwebtoken");

// (4) [ POST, 루트 경로 ] 에 대해 이 핸들러 실행
router.post("/", async (req, res) => {
	// (5) req.body 에서 name, email, password 값 추출
  const { name, email, password } = req.body;

  try {
		// (6) email 가진 사용자 찾기
    let user = await User.findOne({ email });
		// (7) email 중복 방지
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
		// (8) 존재하지 않는 email 인 경우, 새로운 사용자 객체 생성
    user = new User({
      name,
      email,
      password,
    });

		// (9) password 암호화
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
		// (10) DB 에 user 저장
    await user.save();

    return res.status(200).send(true);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
// (13) 모듈 내보내기
module.exports = router;