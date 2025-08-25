// controllers/eventController.js
const Event = require('../models/Event');

// Create event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, organizerName } = req.body;
    
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      organizerName,
      eventBanner: req.file ? req.file.path : '',
      createdBy: req.user._id
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (event) {
      // Check if user is the creator of the event
      if (event.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this event' });
      }
      
      event.title = req.body.title || event.title;
      event.description = req.body.description || event.description;
      event.date = req.body.date || event.date;
      event.time = req.body.time || event.time;
      event.location = req.body.location || event.location;
      event.organizerName = req.body.organizerName || event.organizerName;
      
      if (req.file) {
        event.eventBanner = req.file.path;
      }
      
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (event) {
      // Check if user is the creator of the event
      if (event.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this event' });
      }
      
      await Event.deleteOne({ _id: req.params.id });
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};