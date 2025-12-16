const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const { kræverLogin } = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'din-hemmelige-nøgle-her', // Skift dette til en sikker nøgle i produktion
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Sæt til true hvis du bruger HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 timer
    }
}));

// Servér statiske filer (HTML, CSS, JS)
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);

// Beskyt event routes - kræver login
app.use('/api/events', kræverLogin, eventRoutes);

// Redirect til login side som standard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Noget gik galt!' });
});

// Database connection
mongoose.connect('mongodb://localhost:27017/kalender')
    .then(() => console.log('Forbundet til MongoDB'))
    .catch(err => console.error('MongoDB forbindelsesfejl:', err));

app.listen(3000, () => {
    console.log('Server kører på http://localhost:3000');
});
