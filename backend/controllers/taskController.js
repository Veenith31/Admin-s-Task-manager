/*const Task = require('../models/Task');
const Agent = require('../models/Agent');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Task.find(JSON.parse(queryStr)).populate('agent');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-assignedAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Task.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const tasks = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination,
      data: tasks
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('agent');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('agent');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne();

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

// @desc    Upload CSV and distribute tasks
// @route   POST /api/tasks/upload
// @access  Private/Admin
exports.uploadTasks = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    const tasks = [];
    const agents = await Agent.find({ isActive: true });
    
    if (agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active agents found. Please create agents first.'
      });
    }

    // Process CSV file
    if (fileExtension === 'csv') {
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => {
            if (row.FirstName && row.Phone) {
              tasks.push({
                firstName: row.FirstName,
                phone: row.Phone,
                notes: row.Notes || ''
              });
            }
          })
          .on('end', () => {
            resolve();
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    } 
    // Process Excel files
    else if (['xlsx', 'xls'].includes(fileExtension)) {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      data.forEach(row => {
        if (row.FirstName && row.Phone) {
          tasks.push({
            firstName: row.FirstName,
            phone: row.Phone,
            notes: row.Notes || ''
          });
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Only CSV, XLSX, and XLS files are allowed.'
      });
    }

    // Distribute tasks among agents
    const distributedTasks = [];
    const agentCount = agents.length;
    
    for (let i = 0; i < tasks.length; i++) {
      const agentIndex = i % agentCount;
      const agentId = agents[agentIndex]._id;
      
      const taskData = {
        ...tasks[i],
        agent: agentId
      };
      
      distributedTasks.push(taskData);
    }

    // Save tasks to database
    const createdTasks = await Task.insertMany(distributedTasks);
    
    // Update agents with their assigned tasks
    for (let i = 0; i < agents.length; i++) {
      const agentTasks = createdTasks.filter(task => 
        task.agent.toString() === agents[i]._id.toString()
      );
      
      await Agent.findByIdAndUpdate(
        agents[i]._id,
        { $push: { tasksAssigned: { $each: agentTasks.map(t => t._id) } } }
      );
    }

    // Delete the uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: `Successfully uploaded and distributed ${createdTasks.length} tasks among ${agentCount} agents`,
      data: createdTasks
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
*/

const Task = require('../models/Task');
const Agent = require('../models/Agent');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Task.find(JSON.parse(queryStr)).populate('agent');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-assignedAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Task.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const tasks = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination,
      data: tasks
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('agent');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne();

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

// @desc    Upload CSV and distribute tasks
// @route   POST /api/tasks/upload
// @access  Private/Admin
exports.uploadTasks = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    const tasks = [];
    const agents = await Agent.find({ isActive: true });
    
    if (agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active agents found. Please create agents first.'
      });
    }

    // Process CSV file
    if (fileExtension === 'csv') {
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => {
            if (row.FirstName && row.Phone) {
              tasks.push({
                firstName: row.FirstName,
                phone: row.Phone,
                notes: row.Notes || ''
              });
            }
          })
          .on('end', () => {
            resolve();
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    } 
    // Process Excel files
    else if (['xlsx', 'xls'].includes(fileExtension)) {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      data.forEach(row => {
        if (row.FirstName && row.Phone) {
          tasks.push({
            firstName: row.FirstName,
            phone: row.Phone,
            notes: row.Notes || ''
          });
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Only CSV, XLSX, and XLS files are allowed.'
      });
    }

    // Distribute tasks among agents
    const distributedTasks = [];
    const agentCount = agents.length;
    
    for (let i = 0; i < tasks.length; i++) {
      const agentIndex = i % agentCount;
      const agentId = agents[agentIndex]._id;
      
      const taskData = {
        ...tasks[i],
        agent: agentId
      };
      
      distributedTasks.push(taskData);
    }

    // Save tasks to database
    const createdTasks = await Task.insertMany(distributedTasks);
    
    // Update agents with their assigned tasks
    for (let i = 0; i < agents.length; i++) {
      const agentTasks = createdTasks.filter(task => 
        task.agent.toString() === agents[i]._id.toString()
      );
      
      await Agent.findByIdAndUpdate(
        agents[i]._id,
        { $push: { tasksAssigned: { $each: agentTasks.map(t => t._id) } } }
      );
    }

    // Delete the uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: `Successfully uploaded and distributed ${createdTasks.length} tasks among ${agentCount} agents`,
      data: createdTasks
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};