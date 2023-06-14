/* model/User.js */

// (1) mongoose 모듈 불러오기
const mongoose = require("mongoose");

// (2) 스키마 객체 UserSchema 생성
// → 스키마는 MongoDB 컬렉션 구조를 정의하는데 사용
const UserSchema = new mongoose.Schema({
  name: {
    // (3) 필드의 type
    type: String,
    // (4) 필수 필드 : 필수 필드는 반드시 값이 있어야함
    required: true,
  },
  email: {
    type: String,
    required: true,
    // (5) 고유 필드 : 해당 값은 중복 허용 X
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// (6) UserSchema 를 기반으로 User 모델 생성
// → User 는 MongoDB 의 user 컬렉션과 매핑됨
// → ∴ User 모델은 user 컬렉션의 데이터 CRUD 등 작업을 할 수 있음
const User = mongoose.model("user", UserSchema);

// (7) User 모듈 내보내기
module.exports = User;
