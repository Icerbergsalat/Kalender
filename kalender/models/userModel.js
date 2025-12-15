const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    brugernavn: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    adgangskode: {
        type: String,
        required: true
    },
    oprettet: {
        type: Date,
        default: Date.now
    }
});

// Hash adgangskode før den gemmes
userSchema.pre('save', async function(next) {
    if (!this.isModified('adgangskode')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.adgangskode = await bcrypt.hash(this.adgangskode, salt);
    } catch (error) {
        next(error);
    }
});

// Metode til at verificere adgangskode
userSchema.methods.verificerAdgangskode = async function(adgangskode) {
    return await bcrypt.compare(adgangskode, this.adgangskode);
};

module.exports = mongoose.model('User', userSchema);