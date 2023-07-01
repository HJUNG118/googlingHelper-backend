require("dotenv").config();
const { connectDB, getDB } = require("../config/mongodb");

// 스크랩 텍스트 삭제
const deleteMemo = async (username, time) => {
  try {
    await connectDB("memo");
    const userScrapCollection = getDB("memo").collection(username);
    const deletionResult = await userScrapCollection.deleteOne({
      time: time,
    });
    if (deletionResult.deletedCount === 0) {
      return { message: "Nonexistent" };
    }
    return { message: "success" };
  } catch (error) {
    return { message: "error" };
  }
};

module.exports = { deleteMemo };
