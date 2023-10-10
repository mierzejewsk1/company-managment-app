const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const requireAllFields = require('../middleware/requireAllFields/requireAllFields');
const fields = require('../middleware/requireAllFields/requiredFields/userFields');

const userController = require('../controllers/userController');
const router = express.Router();

router.post('/login', requireAllFields(fields.loginFields), userController.LoginUser);


router.use(requireAuth);
router.post('/logout', userController.LogoutUser);
router.use(userController.ValidateLogin);

module.exports = router;