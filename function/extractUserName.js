const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const conn_str = process.env.mongoURI;
const secretKey = process.env.jwtSecret;

const { isTokenBlacklisted } = require("../middleware/tokenBlacklist");

const extractUserName = async (token) => {
  try {
    
    const TokenBlacklisted = isTokenBlacklisted(token);
    if (TokenBlacklisted) {
      throw new Error("Token is blacklisted");
    }

    const decoded = jwt.verify(token, secretKey);
    const decodedUser = decoded.user; // 사용자 ID 반환
    const userID = String(decodedUser.id);
    const client = await MongoClient.connect(conn_str);
    const database = client.db("test");
    const usersCollection = database.collection("users");
    const user = await usersCollection.findOne({ _id: new ObjectId(userID) });

    if (user) {
      const userName = user.name;
      return userName;
    } else {
      return { message: "User not found" };
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { extractUserName };


    