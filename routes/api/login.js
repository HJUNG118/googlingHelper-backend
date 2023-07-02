const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { connectDB, getDB } = require("../../config/mongodb");

router.post("/", async (req, res) => {
  const email = req.headers.email;
  const password = req.headers.password;

  try {
    await connectDB("test");

    const user = await getDB("test").collection("users").findOne({ email });

    // 사용자가 존재하지 않는 경우
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid email" }] });
    }

    // 비밀번호 일치 여부 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // JWT 생성
    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
