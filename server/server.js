const path = require('path');
const express = require('express');

const PORT = process.env.port || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();

app.use(express.static(publicPath));

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));