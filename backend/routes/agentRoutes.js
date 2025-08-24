/*const express = require('express');
const {
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(getAgents)
  .post(createAgent);

router
  .route('/:id')
  .get(getAgent)
  .put(updateAgent)
  .delete(deleteAgent);

module.exports = router;
*/

const express = require('express');
const {
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(getAgents)
  .post(createAgent);

router
  .route('/:id')
  .get(getAgent)
  .put(updateAgent)
  .delete(deleteAgent);

module.exports = router;