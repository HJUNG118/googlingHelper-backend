// // (1) express 모듈 가져오기
// const express = require("express");
// // (2) 라우터 객체 : 클라이언트로부터 요청이 오면, 해당 요청을 처리할 함수를 결정하는 객체
// const router = express.Router();
// // (3) 경로에 있는 함수를 가져옴
// const auth = require("../../middleware/auth");
// const User = require("../../models/user");

// // (4) [ GET, 루트 경로 ] 요청 시 auth 함수가 실행됨, auth 성공 시 아래 try-catch 문 실행
// router.get("/", auth, async (req, res) => {
//   try {
// 		// (5) DB에서 req.user.id 와 일치하는 사용자 찾고, 그 객체에서 password 필드 제외하고 return
//     const user = await User.findById(req.user.id).select("-password");
// 		// (6) JSON 형태로 user 정보를 response 로 보냄
//     res.json(user);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });
// // (7) 이 라우터 모듈 내보내기
// module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  res.send("로그인된 유저가 요청한 응답");
});

module.exports = router;
