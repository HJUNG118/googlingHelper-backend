require("dotenv").config();
const { connectDB, getDB } = require("../config/mongodb");

// 스크랩 텍스트 삭제
const deleteScrapText = async (username, url, title, date, text) => {
  try {
    await connectDB("scrapData");
    const userScrapCollection = getDB("scrapData").collection(username);

    const updateResult = await userScrapCollection.updateOne(
      {
        user: username,
        url: url,
        title: title,
        date: date,
      },
      {
        $pull: {
          text: text,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
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

module.exports = { deleteScrapText };
