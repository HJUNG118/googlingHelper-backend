const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cache = require("memory-cache");
const secretKey = process.env.jwtSecret;
require("dotenv").config();
const { connectDB, getDB } = require("../config/mongodb");

const { isTokenBlacklisted } = require("../middleware/tokenBlacklist");

const extractUserName = async (token) => {
  try {
    

    const TokenBlacklisted = isTokenBlacklisted(token);
    if (TokenBlacklisted) {
      throw new Error("Token is blacklisted");
    }

    if (token === undefined) {
      console.log("Token is undefined");
      throw new Error("Token is undefined");
    }

    let userName = cache.get(token);
    if (userName) {
      return userName;
    }

    await connectDB("test");

    const decoded = jwt.verify(token, secretKey);
    const decodedUser = decoded.user; // 사용자 ID 반환
    const userID = String(decodedUser.id);
    const database = getDB("test");
    const usersCollection = database.collection("users");
    const user = await usersCollection.findOne({ _id: new ObjectId(userID) });

    if (user) {
      userName = user.name;
      cache.put(token, userName, 3600 * 1000);
      return userName;
    } else {
      return { message: "User not found" };
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { extractUserName };
