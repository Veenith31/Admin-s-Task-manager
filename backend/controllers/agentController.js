/*const Agent = require('../models/Agent');
const Task = require('../models/Task');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private/Admin
exports.getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().populate('tasksAssigned');

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Private/Admin
exports.getAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id).populate('tasksAssigned');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create agent
// @route   POST /api/agents
// @access  Private/Admin
exports.createAgent = async (req, res, next) => {
  try {
    const agent = await Agent.create(req.body);

    res.status(201).json({
      success: true,
      data: agent
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private/Admin
exports.updateAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
exports.deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Reassign tasks before deleting agent
    await Task.updateMany(
      { agent: req.params.id },
      { $set: { agent: null } }
    );

    await agent.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
*/

const Agent = require('../models/Agent');
const Task = require('../models/Task');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private/Admin
exports.getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().populate('tasksAssigned');

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Private/Admin
exports.getAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id).populate('tasksAssigned');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create agent
// @route   POST /api/agents
// @access  Private/Admin
exports.createAgent = async (req, res, next) => {
  try {
    const agent = await Agent.create(req.body);

    res.status(201).json({
      success: true,
      data: agent
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private/Admin
exports.updateAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
exports.deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Reassign tasks before deleting agent
    await Task.updateMany(
      { agent: req.params.id },
      { $set: { agent: null } }
    );

    await agent.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};