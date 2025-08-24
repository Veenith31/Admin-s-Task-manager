
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add first name']
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  notes: {
    type: String,
    required: false
  },
  agent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Agent',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Task', taskSchema);