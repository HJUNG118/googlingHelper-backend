// // (1) mongoose 모듈 가져오기
// // → mongoose : MongoDB 와 상호작용을 위한 라이브러리
// const mongoose = require("mongoose");
// // (2) config 모듈 가져오기
// // → 설정 정보를 관리하기 위함
// const config = require("config");
// // (3) config 파일 안에 있는 mongoURI 값 가져오기
// const uri = config.get("mongoURI");

// // (4) 비동기 함수, MongoDB 에 연결하는 역할
// const connectDB = async () => {
//   try {
// 		// (5) mongoURI 값을 기반으로 MongoDB에 연결 시도
//     await mongoose.connect(uri, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//     });
// 		// (6) 연결 성공 시, 아래 log 가 출력됨
//     console.log("MongoDB Connected...");
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// };
// // (7) connectDB 함수를 모듈로 내보내기
// // → ∴ 다른 파일에서 require 로 이 파일을 가져오고, connectDB 를 사용할 수 있음
// module.exports = connectDB;