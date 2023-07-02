require("dotenv").config();
const { getDB, connectDB } = require("../config/mongodb");

const extractImages = async (username) => {
  let images;
  try {
    await connectDB("scrapData");
    const scrapCollection = getDB("scrapData").collection(username);

    // Find all documents and include only the 'img' field
    const documents = await scrapCollection
      .find({}, { projection: { _id: 0, img: 1 } })
      .toArray();

    // Extract 'img' field from each document
    images = documents.flatMap((document) => document.img).reverse();
  } catch (error) {
    return Promise.reject(error);
  }
  return images;
};

module.exports = { extractImages };
