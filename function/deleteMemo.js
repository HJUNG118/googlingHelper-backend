require('dotenv').config();
const { client } = require('../config/mongodb');


// 스크랩 텍스트 삭제
const deleteMemo = async (username, time) => {
  try {
    const database = client.db('memo');
    const userScrapCollection = database.collection(username);
    const deletionResult = await userScrapCollection.deleteOne({
      time: time,
    });
    if (deletionResult.deletedCount === 0) {
      client.close();
      return { message: 'Nonexistent' };
    }
    client.close();
    return { message: 'success' };
  } catch (error) {
    client.close();
    return { message: 'error' };
  }
};

module.exports = { deleteMemo };
