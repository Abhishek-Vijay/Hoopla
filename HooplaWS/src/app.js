const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes.js');
const prodRouter = require('./routes/prodRoutes.js')
const sellerRouter=require('./routes/sellerRoutes.js')

const requestLogger = require('./utilities/requestlogger');
const errorlogger = require('./utilities/errorlogger');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(requestLogger);
app.use('/', userRouter);
app.use('/', prodRouter);
app.use('/seller', sellerRouter);

app.use(errorlogger)
const appPort = 2000

app.listen(appPort);
console.log("Service Started at port:", appPort);