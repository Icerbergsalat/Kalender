const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const budgetRoute = require('./routes/budgetRoute');
const transactionRoute = require('./routes/transactionRoute');
const userRoute = require('./routes/userRoute');
const { logger } = require('./middlewares/logger');

const app = express();

mongoose.connect('mongodb://localhost:27017/budgetApp');

app.use(express.json()); app.use(logger);
app.use('/api', budgetRoute);
app.use('/api', transactionRoute);
app.use('/api', userRoute);

app.listen(3000, () => console.log('Server kører på port 3000'));

