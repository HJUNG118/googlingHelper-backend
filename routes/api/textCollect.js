const express = require("express");
const router = express.Router();

const { extractUserName } = require("../../function/extractUserName");
const { textCollect } = require("../../function/textCollect");

router.get("/", async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7);
    }

    const username = await extractUserName(userToken);
    const dataToSend = await textCollect(username);

    if (dataToSend.length === 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json(dataToSend);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error-textCollect" });
  }
});

module.exports = router;
