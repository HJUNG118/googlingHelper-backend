require("dotenv").config();
const { MongoClient } = require("mongodb");
const conn_str = process.env.mongoURI;

// 최신 날짜 순으로 키워드 정렬, 키워드에 해당하는 url은 시간 순으로 정렬
const checkStorage = async (username) => {
  try {
    const client = await MongoClient.connect(conn_str);
    console.log("Atlas에 연결 완료");
    const database = client.db("scrapData");
    const userScrapCollection = database.collection(username);
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
            },
          },
        },
      },
      {
        $unwind: "$keywords",
      },
      {
        $sort: {
          "keywords.times": -1,
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
    // result를 클라이언트에게 전송
    client.close();

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { checkStorage };
