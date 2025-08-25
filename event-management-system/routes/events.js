// routes/events.js
const express = require('express');
const { 
  createEvent, 
  getEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(auth, upload, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(auth, upload, updateEvent)
  .delete(auth, deleteEvent);

module.exports = router;