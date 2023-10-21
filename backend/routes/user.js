const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const requireAllFields = require('../middleware/requireAllFields/requireAllFields');
const fields = require('../middleware/requireAllFields/requiredFields/userFields');

const userController = require('../controllers/userController');
const router = express.Router();

router.post('/login', requireAllFields(fields.loginFields), userController.LoginUser);
router.patch('/reset-password', requireAllFields(fields.resetPasswordFields), userController.ResetPassword);
router.post('/send-reset-password-email-html', requireAllFields(fields.sendResetPasswordEmailHTMLFields), userController.SendResetPasswordEmailHTML);

router.use(requireAuth);
router.post('/logout', userController.LogoutUser);
router.post('/employee', requireAllFields(fields.createEmployeeFields), userController.CreateEmployee);
router.get('/employees', userController.DisplayEmployees);
router.delete('/employee', requireAllFields(fields.deleteEmployeeFields), userController.DeleteEmployee);
router.patch('/employee', requireAllFields(fields.editEmployeeFields), userController.EditEmployee);
router.use(userController.ValidateLogin);

module.exports = router;