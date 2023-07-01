require("dotenv").config();
const { connectDB, getDB } = require("../config/mongodb");

// 최신 날짜 순으로 키워드 정렬, 키워드에 해당하는 url은 시간 순으로 정렬
const textCollect = async (username) => {
  try {
    await connectDB("scrapData");
    const userScrapCollection = getDB("scrapData").collection(username);

    // 코드 작성
    const documents = await userScrapCollection.find({}).toArray();
    const result = [];

    const keywordMap = new Map();

    for (const doc of documents) {
      if (doc.text && doc.text.length > 0) {
        if (keywordMap.has(doc.keyWord)) {
          keywordMap.get(doc.keyWord).push(...doc.text);
        } else {
          keywordMap.set(doc.keyWord, [...doc.text]);
        }
      }
    }

    for (const [keyWord, text] of keywordMap.entries()) {
      result.push({ keyWord, text });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { textCollect };
