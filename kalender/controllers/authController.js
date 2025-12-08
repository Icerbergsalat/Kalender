const User = require('../models/userModel');

// Registrer ny bruger
exports.registrer = async (req, res) => {
    try {
        const { brugernavn, adgangskode } = req.body;

        // Tjek om brugernavn er tomt
        if (!brugernavn || !adgangskode) {
            return res.status(400).json({ 
                success: false, 
                message: 'Brugernavn og adgangskode er påkrævet' 
            });
        }

        // Tjek om bruger allerede eksisterer
        const eksisterendeBruger = await User.findOne({ brugernavn });
        if (eksisterendeBruger) {
            return res.status(400).json({ 
                success: false, 
                message: 'Brugernavn er allerede taget' 
            });
        }

        // Opret ny bruger
        const nyBruger = await User.create({ brugernavn, adgangskode });
        
        // Gem bruger i session
        req.session.userId = nyBruger._id;
        req.session.brugernavn = nyBruger.brugernavn;

        res.status(201).json({ 
            success: true, 
            message: 'Bruger oprettet succesfuldt',
            brugernavn: nyBruger.brugernavn
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Fejl ved oprettelse af bruger: ' + error.message 
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { brugernavn, adgangskode } = req.body;

        // Tjek om brugernavn og adgangskode er givet
        if (!brugernavn || !adgangskode) {
            return res.status(400).json({ 
                success: false, 
                message: 'Brugernavn og adgangskode er påkrævet' 
            });
        }

        // Find bruger
        const bruger = await User.findOne({ brugernavn });
        if (!bruger) {
            return res.status(401).json({ 
                success: false, 
                message: 'Forkert brugernavn eller adgangskode' 
            });
        }

        // Verificer adgangskode
        const erKorrekt = await bruger.verificerAdgangskode(adgangskode);
        if (!erKorrekt) {
            return res.status(401).json({ 
                success: false, 
                message: 'Forkert brugernavn eller adgangskode' 
            });
        }

        // Gem bruger i session
        req.session.userId = bruger._id;
        req.session.brugernavn = bruger.brugernavn;

        res.status(200).json({ 
            success: true, 
            message: 'Login succesfuldt',
            brugernavn: bruger.brugernavn
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Fejl ved login: ' + error.message 
        });
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Fejl ved logout' 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Logout succesfuldt' 
        });
    });
};

// Tjek om bruger er logget ind
exports.tjekLogin = (req, res) => {
    if (req.session.userId) {
        res.status(200).json({ 
            success: true, 
            loggetInd: true,
            brugernavn: req.session.brugernavn
        });
    } else {
        res.status(200).json({ 
            success: true, 
            loggetInd: false 
        });
    }
};
