require('dotenv').config();
require('./database/connect');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

app.engine('handlebars', exphbs({ defaulyLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(require('./routes/routes'));

app.listen(process.env.PORT, () => { console.log(`Listening on port ${process.env.PORT}`)});

