const express = require("express");
const router = express.Router();
const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors());

const { extractUserName } = require("../../function/extractUserName");
const { searchData } = require("../../function/searchData");

router.post("/", async (req, res) => {
  try {
    const { search } = req.body;
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7);
    }

    const username = await extractUserName(userToken);
    const result = await searchData(username, search);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
