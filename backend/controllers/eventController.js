
const Event = require('../models/eventModel');

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch events' });
    }
};

exports.createEvent = async (req, res) => {
    const { title, date, location, description } = req.body;
    try {
        const newEvent = new Event({ title, date, location, description });
        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create event' });
    }
};
