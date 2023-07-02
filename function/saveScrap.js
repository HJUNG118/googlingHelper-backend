require("dotenv").config();
const { ObjectId } = require("mongodb");
const { connectDB, getDB } = require("../config/mongodb");

const saveScrap = async (
  username,
  keyWord,
  url,
  date,
  time,
  title,
  texts,
  img
) => {
  try {
    await connectDB("scrapData");
    // const session = getDB('scrapData').startSession(); // 세션 생성
    // session.startTransaction(); // 트랜잭션 시작

    const scrapCollection = getDB("scrapData").collection(username);
    const existingScrap = await scrapCollection.findOne({
      date: date,
      title: title,
    });
    let updateResult;
    if (existingScrap) {
      const existingScrapId = new ObjectId(existingScrap._id);
      if (texts && texts.length > 0) {
        updateResult = await scrapCollection.updateOne(
          { _id: existingScrapId },
          { $push: { text: texts } }
        );
      } else if (img && img.length > 0) {
        updateResult = await scrapCollection.updateOne(
          { _id: existingScrapId },
          { $push: { img: img } }
        );
      } else {
        return "duplicate";
      }
      if (updateResult && updateResult.modifiedCount > 0) {
        return "update";
      } else {
        throw new Error("Failed to update");
      }
    } else {
      const newScrap = {
        user: username,
        keyWord: keyWord,
        title: title,
        url: url,
        time: time,
        date: date,
        text: texts && texts.length > 0 ? [texts] : [], // Store texts if it exists, otherwise store an empty array
        img: img && img.length > 0 ? [img] : [], // Store img if it exists, otherwise store an empty array
      };

      const insertResult = await scrapCollection.insertOne(newScrap);
      if (insertResult.insertedId) {
        return "complete";
      } else {
        throw new Error("Failed to insert");
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { saveScrap };
