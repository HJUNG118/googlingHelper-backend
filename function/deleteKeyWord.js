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
      return { message: "삭제된 데이터가 없습니다." };
    }

    const count = await userScrapCollection.countDocuments();
    if (count === 0) {
      await userScrapCollection.drop();
    }

    return { message: "데이터 삭제 완료" };
  } catch (error) {
    console.error(error);
    return { message: "데이터 삭제 에러" };
  }
};

module.exports = { deleteKeyWord };