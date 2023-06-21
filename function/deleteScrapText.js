require("dotenv").config();
const { MongoClient } = require("mongodb");
const conn_str = process.env.mongoURI;

// 스크랩 텍스트 삭제
const deleteScrapText = async (username, url, title, date, text) => {
  try {
    const client = await MongoClient.connect(conn_str);
    const database = client.db("scrapText");
    const userScrapCollection = database.collection(username);

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
