require("dotenv").config();
const { connectDB, getDB } = require("../config/mongodb");

// 최신 날짜 순으로 키워드 정렬, 키워드에 해당하는 url은 시간 순으로 정렬
const checkStorage = async (username) => {
  try {
    await connectDB("scrapData");

    const userScrapCollection = getDB("scrapData").collection(username);
    const cursor = userScrapCollection.aggregate([
      {
        $sort: {
          date: -1,
          time: -1,
        },
      },
      {
        $group: {
          _id: {
            date: "$date",
            keyword: "$keyWord",
          },
          title: {
            $push: "$title",
          },
          url: {
            $push: "$url",
          },
          time: {
            $push: "$time",
          },
          texts: {
            $push: "$text",
          },
          img: {
            $push: "$img",
          },
        },
      },
      {
        $sort: {
          "_id.date": -1,
          "time.0": -1,
        },
      },
      {
        $group: {
          _id: "$_id.date",
          keywords: {
            $push: {
              keyword: "$_id.keyword",
              titles: "$title",
              urls: "$url",
              times: "$time",
              texts: "$texts",
              img: "$img",
            },
          },
        },
      },
      {
        $unwind: "$keywords",
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $project: {
          date: "$_id",
          keywords: 1,
          _id: 0,
        },
      },
    ]);
    const result = await cursor.toArray();
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { checkStorage };
