require('dotenv').config();
const { MongoClient } = require('mongodb');
const conn_str = process.env.mongoURI;

// 최신 날짜 순으로 키워드 정렬, 키워드에 해당하는 url은 시간 순으로 정렬
const checkKeyword = async (username) => {
  try {
    const client = await MongoClient.connect(conn_str);
    console.log('Atlas에 연결 완료');
    const database = client.db('scrapData');
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
            keyword: '$keyWord',
            date: '$date',
          },
          title: {
            $push: '$title',
          },
          url: {
            $push: '$url',
          },
          time: {
            $push: '$time',
          },
          texts: {
            $push: '$text',
          },
          img: {
            $push: '$img',
          },
        },
      },
      {
        $group: {
          _id: '$_id.keyword',
          dates: {
            $push: {
              date: '$_id.date',
              titles: '$title',
              urls: '$url',
              times: '$time',
              texts: '$texts',
              img: '$img',
            },
          },
        },
      },
      {
        $unwind: '$dates',
      },
      {
        $sort: {
          _id: 1,
          'dates.date': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          dates: {
            $push: {
              date: '$dates.date',
              titles: '$dates.titles',
              urls: '$dates.urls',
              times: '$dates.times',
              texts: '$dates.texts',
              img: '$dates.img',
            },
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $project: {
          keyword: '$_id',
          dates: 1,
          _id: 0,
        },
      },
    ]);
    const result = await cursor.toArray();
    client.close();
    return result;
  } catch (error) {
    client.close();
    throw error;
  }
};

// 함수를 export
module.exports = { checkKeyword };
