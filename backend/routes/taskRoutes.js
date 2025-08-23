const express = require('express');
const {
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  uploadTasks
} = require('../controllers/taskController');

const upload = require('../utils/fileUpload');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTasks);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(authorize('admin'), deleteTask);

router.post('/upload', authorize('admin'), (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err
      });
    } else {
      if (req.file === undefined) {
        return res.status(400).json({
          success: false,
          message: 'No file selected'
        });
      } else {
        uploadTasks(req, res);
      }
    }
  });
});

module.exports = router;