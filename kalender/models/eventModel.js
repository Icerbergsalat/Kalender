const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    id: {type: Number, required: true, unique: true},
    title: {type: String, required: true},
    date: {type: Date},
    entryFee: {type: Number, default: 0},
    location: {type: String},
    description: {type: String},
    participants: {type: Number, default: 0, required: true},
    eventPlanner: {type: String},
    // Nye felter til vejr og coordinates
    coordinates: {
        lat: {type: Number},
        lng: {type: Number}
    },
    weather: {
        temperature: {type: Number},
        weatherCode: {type: Number},
        description: {type: String}
    }
});

module.exports = mongoose.model('Event', eventSchema);