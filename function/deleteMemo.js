require('dotenv').config();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;

// 스크랩 텍스트 삭제
const deleteMemo = async (username, memoTitle) => {
  const client = await MongoClient.connect(conn_str);
  try {
    const database = client.db('memo');
    const userScrapCollection = database.collection('memos');

    // 데이터 삭제
    const deletionResult = await userScrapCollection.deleteOne({
      username: username,
      memoTitle: memoTitle,
    });

    if (deletionResult.deletedCount === 0) {
      return { message: 'Nonexistent ' };
    }
    return { message: 'success' };
  } catch (error) {
    console.error(error);
    return { message: 'error' };
  }
};

module.exports = { deleteMemo };
