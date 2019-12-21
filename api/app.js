const express = require('express');
const authenticator = require('./utilities/authenticator');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('./utilities/log_attributes');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const productsRouter = require('./routes/product');
const customerRouter = require('./routes/customer');
const invoiceRouter = require('./routes/invoice');

// Creating the web app from express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allowing JSON to be parsed as request parameter
app.use(bodyParser.json({type: '*/*'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(authenticator);

// All the routers defined above
// All path and route middlewares defined below
app.use('/', indexRouter);
app.use('/user' ,usersRouter);
app.use('/product', productsRouter);
app.use('/customer', customerRouter);
app.use('/invoice', invoiceRouter);

module.exports = app;