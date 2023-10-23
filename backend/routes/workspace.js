const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const requireAllFields = require('../middleware/requireAllFields/requireAllFields');
const fields = require('../middleware/requireAllFields/requiredFields/workspaceFields');

const userController = require('../controllers/userController');
const workspaceController = require('../controllers/workspaceController');
const router = express.Router();
router.use(requireAuth);
router.get('/workspaces', workspaceController.DisplayWorkspaces);
router.post('/workspace', requireAllFields(fields.assignEmployeeToWorkspace), workspaceController.AssignEmployeeToWorkspace);
router.delete('/workspace', requireAllFields(fields.deleteEmployeeFromWorkspace), workspaceController.DeleteEmployeeFromWorkspace);
router.patch('/workspace-block', requireAllFields(fields.blockWorkspace), workspaceController.BlockWorkspace);
router.patch('/workspace-unblock', requireAllFields(fields.blockWorkspace), workspaceController.UnblockWorkspace);

router.use(userController.ValidateLogin);

module.exports = router;