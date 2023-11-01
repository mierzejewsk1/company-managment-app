const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const requireAllFields = require('../middleware/requireAllFields/requireAllFields');
const fields = require('../middleware/requireAllFields/requiredFields/tasksFields');
const userController = require('../controllers/userController');
const tasksController = require('../controllers/tasksController');
const router = express.Router();

router.use(requireAuth);

router.get('/tasks', tasksController.DisplayTasks);
router.post('/tasks', requireAllFields(fields.addTasks), tasksController.AddTasks);
router.patch('/tasks', requireAllFields(fields.toggleTasks), tasksController.ToggleTasks);

router.use(userController.ValidateLogin);
module.exports = router;