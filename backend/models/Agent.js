/*const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add agent name']
  },
  email: {
    type: String,
    required: [true, 'Please add agent email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  mobile: {
    type: String,
    required: [true, 'Please add mobile number with country code']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tasksAssigned: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Task'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Agent', agentSchema);
*/
const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add agent name']
  },
  email: {
    type: String,
    required: [true, 'Please add agent email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  mobile: {
    type: String,
    required: [true, 'Please add mobile number with country code']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tasksAssigned: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Task'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Agent', agentSchema);