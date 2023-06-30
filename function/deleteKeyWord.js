require('dotenv').config();
const { client } = require('../config/mongodb');

const deleteKeyWord = async (username, keyWord) => {
  try {
    const database = client.db('scrapData');
    const userScrapCollection = database.collection(username);

    // 데이터 삭제
    const deletionResult = await userScrapCollection.deleteMany({
      keyWord: keyWord,
    });

    if (deletionResult.deletedCount === 0) {
      client.close();
      return { message: 'error' };
    }

    const count = await userScrapCollection.countDocuments();
    if (count === 0) {
      await userScrapCollection.drop();
    }
    client.close();
    return { message: 'success' };
  } catch (error) {
    client.close();
    return { message: 'error' };
  }
};

module.exports = { deleteKeyWord };
