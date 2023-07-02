const express = require("express");
const router = express.Router();
const zlib = require("zlib");
const util = require("util");
const brotliSettings = {
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 5,
  },
};
const brotliCompress = util.promisify(zlib.brotliCompress);
const { extractUserName } = require("../../function/extractUserName");
const { checkStorage } = require("../../function/checkStorage");

router.post("/", async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7);
    }

    const username = await extractUserName(userToken);
    const dataToSend = await checkStorage(username);

    let responsePayload;

    if (dataToSend.length === 0) {
      responsePayload = Buffer.from(JSON.stringify(username));
    } else {
      responsePayload = Buffer.from(JSON.stringify({ dataToSend, username }));
    }

    if (
      req.headers["accept-encoding"] &&
      req.headers["accept-encoding"].includes("br")
    ) {
      res.setHeader("Content-Encoding", "br");
      res.setHeader("Content-Type", "application/json");
      responsePayload = await brotliCompress(responsePayload, brotliSettings);
    }

    res.status(200).send(responsePayload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error-checkStorage" });
  }
});

module.exports = router;
