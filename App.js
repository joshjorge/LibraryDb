const express = require('express');
const winston = require('winston');
const app = express();

require('./startUp/logging');
require('./startUp/routes')(app);
require('./startUp/db')();
require('./startUp/config')();
require('./startUp/validation')();
require('./startUp/prod')(app);

const port = process.env.Port || 400;
app.listen(port, () => winston.info(`Listerning on ${port}`));