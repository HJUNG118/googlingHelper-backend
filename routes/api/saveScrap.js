const express = require("express");
const router = express.Router();
const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors());

const { getDateAndTime } = require("../../function/getDateAndTime");
const { extractUserName } = require("../../function/extractUserName");
const { saveScrap } = require("../../function/saveScrap");

router.post("/", async (req, res) => {
  try {
    const { keyWord, url, title } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7);
    }
    const dateTime = await getDateAndTime();
    const username = await extractUserName(userToken);
    const result = await saveScrap(
      username,
      keyWord,
      url,
      dateTime.date,
      dateTime.time,
      title,
      null,
      null
    );

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
