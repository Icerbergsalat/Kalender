const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/events', eventRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

mongoose.connect('mongodb://localhost:27017/kalender');

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});