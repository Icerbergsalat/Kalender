const eventModel = require('../models/eventModel');
const { getWeatherForecast } = require('./weatherService');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        // Auto-generér unikt ID
        const lastEvent = await eventModel.findOne().sort({ id: -1 });
        const nextId = lastEvent ? lastEvent.id + 1 : 1;
        
        // Tilføj auto-genereret ID til event data
        const eventData = {
            ...req.body,
            id: nextId
        };
        
        // Hent vejrdata hvis der er coordinates og dato
        if (eventData.coordinates && eventData.coordinates.lat && eventData.coordinates.lng && eventData.date) {
            const weather = await getWeatherForecast(
                eventData.coordinates.lat,
                eventData.coordinates.lng,
                eventData.date
            );
            
            if (weather) {
                eventData.weather = weather;
            }
        }
        
        const newEvent = await eventModel.create(eventData);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Read all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
    try {
        const updatedEvent = await eventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await eventModel.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addParticipant = async (req, res) => {
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        event.participants += 1;
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};