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

    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Task.find(JSON.parse(queryStr)).populate('agent');

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-assignedAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Task.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    const tasks = await query;

    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination,
      data: tasks
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('agent');
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Upload CSV/Excel and distribute tasks
// @route   POST /api/tasks/upload
// @access  Private/Admin
exports.uploadTasks = async (req, res, next) => {
  console.log("➡️ Upload request received");

  try {
    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    console.log("📂 Uploaded file:", req.file.originalname);
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    const tasks = [];
    console.log("🔎 Fetching active agents...");
    const agents = await Agent.find({ isActive: true });
    console.log(`✅ Found ${agents.length} active agents`);

    if (agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active agents found. Please create agents first.'
      });
    }

    // Parse file
    if (fileExtension === 'csv') {
      console.log("📑 Processing CSV file...");
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
            } else {
              console.warn("⚠️ Skipping invalid row:", row);
            }
          })
          .on('end', () => {
            console.log(`✅ Finished parsing CSV, extracted ${tasks.length} tasks`);
            resolve();
          })
          .on('error', (error) => {
            console.error("❌ Error parsing CSV:", error);
            reject(error);
          });
      });
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      console.log("📑 Processing Excel file...");
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
        } else {
          console.warn("⚠️ Skipping invalid row:", row);
        }
      });
      console.log(`✅ Finished parsing Excel, extracted ${tasks.length} tasks`);
    } else {
      console.error("❌ Invalid file type:", fileExtension);
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Only CSV, XLSX, and XLS files are allowed.'
      });
    }

    console.log(`📊 Distributing ${tasks.length} tasks among ${agents.length} agents...`);
    const distributedTasks = [];
    const agentCount = agents.length;

    for (let i = 0; i < tasks.length; i++) {
      const agentIndex = i % agentCount;
      const agentId = agents[agentIndex]._id;

      const taskData = { ...tasks[i], agent: agentId };
      distributedTasks.push(taskData);
    }
    console.log("✅ Distribution complete");

    console.log("💾 Saving tasks to DB...");
    const createdTasks = await Task.insertMany(distributedTasks);
    console.log(`✅ Saved ${createdTasks.length} tasks to DB`);

    console.log("🔄 Updating agents with assigned tasks...");
    for (let i = 0; i < agents.length; i++) {
      const agentTasks = createdTasks.filter(task =>
        task.agent.toString() === agents[i]._id.toString()
      );
      await Agent.findByIdAndUpdate(
        agents[i]._id,
        { $push: { tasksAssigned: { $each: agentTasks.map(t => t._id) } } }
      );
      console.log(`   ↳ Agent ${agents[i]._id} assigned ${agentTasks.length} tasks`);
    }
    console.log("✅ Agent updates complete");

    fs.unlinkSync(req.file.path);
    console.log("🧹 Uploaded file deleted");

    res.status(200).json({
      success: true,
      message: `Successfully uploaded and distributed ${createdTasks.length} tasks among ${agentCount} agents`,
      data: createdTasks
    });
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log("🧹 Cleaned up uploaded file after failure");
    }
    res.status(400).json({ success: false, message: err.message });
  }
};
