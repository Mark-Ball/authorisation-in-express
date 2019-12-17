require('dotenv').config();
require('./database/connect');
const express = require('express');
const app = express();

app.use(require('./routes/routes'));

app.listen(process.env.PORT, () => { console.log(`Listening on port ${process.env.PORT}`)});

