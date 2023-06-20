require("dotenv").config();
const { MongoClient } = require("mongodb");
const conn_str = process.env.mongoURI;

const deleteKeyWord = async (username, keyWord) => {
  try {
    const client = await MongoClient.connect(conn_str);
    const database = client.db("search");
    const userScrapCollection = database.collection(username);

    // 데이터 삭제
    const deletionResult = await userScrapCollection.deleteMany({
      keyWord: keyWord,
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

module.exports = { deleteKeyWord };