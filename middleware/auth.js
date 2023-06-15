// // (1) jsonwebtoken 모듈 가져오기
// const jwt = require("jsonwebtoken");
// require('dotenv').config();


// // (2) authMiddleware
// const authMiddleware = (req, res, next) => { 
// 	// (3) request header 에서 x-auth-token 의 value 를 가져옴
// 	// → value 로 JWT 가 들어 있음
//   const token = req.header("x-auth-token");

// 	// (4) token 이 없을 때 예외처리
//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

// 	// (5) token 이 존재하면, 해당 token 검증
//   try {
// 		// (6) token 검증 후 token 이 유효한 경우 해당 토큰에 포함된 정보를 해독해서 return
// 		// → token 은 JWT, jwtSecret 은 해독할 때 쓰이는 secret key 값
// 		// → decoded 에는 사용자 인증과 관련된 정보가 있음
//     const decoded = jwt.verify(token, process.env.jwtSecret);
// 		// (7) decoded.user 는 토큰 내에 저장된 사용자 정보
//     req.user = decoded.user;
// 		// (8) 다음 미들웨어 함수 실행
//     next();
//   } catch (error) {
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// };
// // (9) authMiddleware 모듈 내보내기
// module.exports = authMiddleware;
// middleware/auth.js

const jwt = require("jsonwebtoken");
require('dotenv').config();

const tokenBlacklist = require("./tokenBlacklist");

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    if (tokenBlacklist.isTokenBlacklisted(token)) {
      return res.status(401).json({ msg: "Token is blacklisted, Please login again" });
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;



