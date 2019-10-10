var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');
var dataDateRouter = require('./routes/datadate');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cmsdb', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/data', dataRouter);
app.use('/api/datadate', dataDateRouter);


module.exports = app;
