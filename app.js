const express = require('express');
const bodyParser = require('body-parser');
const SetupDB = require('./database/config');
const routes = require('./routes/routes');
const app = express();

require('dotenv').config();


let configurationSetting = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}

SetupDB.connect(configurationSetting);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000, type: '*/x-www-form-urlencoded' }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
    next();
});

app.use('/v1/api',routes);

app.use('/', (req, res) => {
    return res.json({
        message: 'Route not found',
        context: 'Route does not exists'
    }).status(404);
});


module.exports = app;