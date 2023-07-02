require("dotenv").config();
const { connectDB, getDB } = require("../config/mongodb");

const deleteKeyWord = async (username, keyWord) => {
  try {
    await connectDB("scrapData");

    const userScrapCollection = getDB("scrapData").collection(username);

    // 데이터 삭제
    const deletionResult = await userScrapCollection.deleteMany({
      keyWord: keyWord,
    });

    if (deletionResult.deletedCount === 0) {
      return { message: "Already deleted keyWord" };
    }

    const count = await userScrapCollection.countDocuments();
    if (count === 0) {
      await userScrapCollection.drop();
    }

    return { message: "success" };
  } catch (error) {
    return { message: "error" };
  }
};

module.exports = { deleteKeyWord };
