const express = require('express');
const app = new express();

// IMPORTING PACKAGES
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./src/routes/api');


// SECURITY IMPLEMENTATION STARTS HERE
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(hpp());

const limiter = rateLimit({
    windowMs: 1000 * 60 *15,
    standardHeaders: 'draft-6',
    legacyHeaders: false,
    limit: 50
});
app.use(limiter);
// SECURITY IMPLEMENTATION ENDS HERE

// MONGODB CONNECTION STARTS HERE
const config = require('./config.js');
mongoose.connect(config.dbUri)
    .then(res => console.log('Database Connected successfully'))
    .catch(err => console.log(err));
// MONGODB CONNECTION ENDS HERE

// ROUTING STARTS HERE
app.use('/api/v1', router);
// Unknown router handling.
app.use('*', (req, res) => {
    res.json({status: 'Not Found!', message: 'API unavailable right now.'});
})
// ROUTING ENDS HERE


module.exports = app;
