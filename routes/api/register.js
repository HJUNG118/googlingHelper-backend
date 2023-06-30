const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
require('dotenv').config();
const { client } = require('../../config/mongodb');

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {

    const db = client.db("test");

    const existingEmail = await db.collection("users").findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    const existingName = await db.collection("users").findOne({ name });
    if (existingName) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).send(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  } finally {
    await client.close(); // MongoDB 연결 종료
  }
});

module.exports = router;
