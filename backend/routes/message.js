const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const requireAllFields = require('../middleware/requireAllFields/requireAllFields');
const fields = require('../middleware/requireAllFields/requiredFields/messageFields');
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const router = express.Router();

router.use(requireAuth);

router.post('/messages', requireAllFields(fields.displayMessages), messageController.DisplayMessaages);
router.post('/message', requireAllFields(fields.sendMessage), messageController.SendMessage);
router.delete('/message', requireAllFields(fields.deleteConversation), messageController.DeleteConversation);
router.delete('/delete-message', requireAllFields(fields.deleteMessage), messageController.DeleteMessage);

router.use(userController.ValidateLogin);
module.exports = router;