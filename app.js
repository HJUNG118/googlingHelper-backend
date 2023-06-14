const express = require('express');
const app = express();
const port = 1010;

app.get('/', (req, res) => {
    res.json({
        success: true,
    });
});

app.listen(port, () => {
    console.log(`Server : http://localhost:${port}`);
});

