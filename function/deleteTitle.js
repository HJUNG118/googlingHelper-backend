require('dotenv').config();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;

// 스크랩 하나 삭제
const deleteTitle = async (username, url, title, date, res) => {
  try {
    const client = await MongoClient.connect(conn_str);
    const database = client.db('scrapData');
    const userScrapCollection = database.collection(username);

    // 데이터 삭제
    const deletionResult = await userScrapCollection.deleteOne({
      user: username,
      url: url,
      title: title,
      date: date,
    });

    if (deletionResult.deletedCount === 0) {
      return { message: 'error' };
    }

    const count = await userScrapCollection.countDocuments();
    if (count === 0) {
      await userScrapCollection.drop();
    }

    return { message: 'success' };
  } catch (error) {
    console.error(error);
    return { message: 'error' };
  }
};

module.exports = { deleteTitle };
