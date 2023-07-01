require("dotenv").config();
const { connectDB, getDB } = require("../config/mongodb");

// 스크랩 하나 삭제
const deleteTitle = async (username, url, title, date, res) => {
  try {
    await connectDB("scrapData");
    const userScrapCollection = getDB("scrapData").collection(username);

    // 데이터 삭제
    const deletionResult = await userScrapCollection.deleteOne({
      user: username,
      url: url,
      title: title,
      date: date,
    });

    if (deletionResult.deletedCount === 0) {
      return { message: "error" };
    }

    const count = await userScrapCollection.countDocuments();
    if (count === 0) {
      await userScrapCollection.drop();
    }

    return { message: "success" };
  } catch (error) {
    console.error(error);
    return { message: "error" };
  }
};

module.exports = { deleteTitle };
