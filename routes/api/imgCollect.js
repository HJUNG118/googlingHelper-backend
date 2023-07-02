const express = require("express");
const router = express.Router();
const app = express();
const zlib = require("zlib");
const util = require("util");
const brotliSettings = {
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 5,
  },
};
const brotliCompress = util.promisify(zlib.brotliCompress);

app.use(express.json());
const cors = require("cors");
app.use(cors());

const { extractUserName } = require("../../function/extractUserName");
const { extractImages } = require("../../function/extractImages");

router.get("/", async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      userToken = authorizationHeader.substring(7);
    }
    const username = await extractUserName(userToken);
    const result = await extractImages(username);

    let responsePayload = Buffer.from(JSON.stringify(result));

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
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
