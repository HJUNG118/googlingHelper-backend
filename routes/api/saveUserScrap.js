/* saveScrapText에 통합 */

// const express = require("express");
// const router = express.Router();
// const app = express();

// app.use(express.json());
// const cors = require("cors");
// app.use(cors());

// const { keyWordByDate } = require("../../function/keyWordByDate");
// const { saveUserScrap } = require("../../function/saveUserScrap");
// const { getDateAndTime } = require("../../function/getDateAndTime");
// const { extractUserName} = require("../../function/extractUserName");

// router.post("/", async (req, res) => {
//   try {
//     const { keyWord, url, title } = req.body;
//     const authorizationHeader = req.headers.authorization;
//     let userToken = null;
//     if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
//       userToken = authorizationHeader.substring(7); // "Bearer " 부분을 제외한 토큰 값 추출
//     }
//     const dateTime = await getDateAndTime();
//     const username = await extractUserName(userToken, process.env.jwtSecret);
//     const result = await saveUserScrap(
//       username,
//       keyWord,
//       url,
//       dateTime.date,
//       dateTime.time,
//       title
//     );
//     const dataToSend = await keyWordByDate(username);
//     res.status(200).json(dataToSend);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;