const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {type: String, required: true},
    date: {type: Date},
    entryFee: {type: Number, default: 0},
    location: {type: String},
    description: {type: String},
    participants: {type: Number, default: 0, required: true},
    eventPlanner: {type: String}
    //forecast: {type: ?????},
});

module.exports = mongoose.model('Event', eventSchema);