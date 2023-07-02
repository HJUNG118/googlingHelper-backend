const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
require("dotenv").config();
const { connectDB, getDB } = require("../../config/mongodb");

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await connectDB("test");

    const existingEmail = await getDB("test")
      .collection("users")
      .findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const existingName = await getDB("test")
      .collection("users")
      .findOne({ name });
    if (existingName) {
      return res.status(400).json({ msg: "User name already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await getDB("test").collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).send(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
