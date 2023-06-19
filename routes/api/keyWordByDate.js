const express = require("express");
const router = express.Router();

const { extractUserName} = require("../../function/extractUserName");
const { keyWordByDate} = require("../../function/keyWordByDate");

// // 최신 날짜 순으로 키워드 정렬, 키워드에 해당하는 url은 시간 순으로 정렬
// const keyWordByDate = async (username) => {
//   try {
//     const client = await MongoClient.connect(conn_str);
//     console.log("Atlas에 연결 완료");
//     const database = client.db("search");
//     const userScrapCollection = database.collection(username);
//     const cursor = userScrapCollection.aggregate([
//       {
//         $sort: {
//           date: -1,
//           time: -1,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             date: "$date",
//             keyword: "$keyWord",
//           },
//           title: {
//             $push: "$title",
//           },
//           url: {
//             $push: "$url",
//           },
//           time: {
//             $push: "$time",
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$_id.date",
//           keywords: {
//             $push: {
//               keyword: "$_id.keyword",
//               titles: "$title",
//               urls: "$url",
//               times: "$time",
//             },
//           },
//         },
//       },
//       {
//         $unwind: "$keywords",
//       },
//       {
//         $sort: {
//           date: -1,
//           "keywords.times": -1,
//         },
//       },
//       {
//         $project: {
//           date: "$_id",
//           keywords: 1,
//           _id: 0,
//         },
//       },
//     ]);
//     const result = await cursor.toArray();
//     result.sort((a, b) => {
//       const dateA = new Date(a.date);
//       const dateB = new Date(b.date);
//       return dateB - dateA;
//     });
//     // result를 클라이언트에게 전송
//     client.close();

//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

router.post("/", async (req, res) => {
  // const { userToken } = req.body;
  const authorizationHeader = req.headers.authorization;
  let userToken = null;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
  }
  const username = await extractUserName(userToken, process.env.jwtSecret);
  try {
    const dataToSend = await keyWordByDate(username);

    if (dataToSend.length === 0) {
      res.status(200).json({ message: "데이터가 없습니다." });
    } else {
      res.status(200).json({ dataToSend, username });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "스크랩 데이터 전송 오류" });
  }
});

module.exports = router;