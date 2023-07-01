const express = require('express');
const router = express.Router();

const { extractUserName } = require('../../function/extractUserName');
const { checkStorage } = require('../../function/checkStorage');

router.post('/', async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    let userToken = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      userToken = authorizationHeader.substring(7);
    }

    const username = await extractUserName(userToken);
    const dataToSend = await checkStorage(username);

    if (dataToSend.length === 0) {
      res.status(200).json(username);
    } else {
      res.status(200).json({ dataToSend, username });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error-checkStorage' });
  }
});

module.exports = router;
