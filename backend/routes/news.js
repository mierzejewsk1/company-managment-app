const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const requireAllFields = require('../middleware/requireAllFields/requireAllFields');
const fields = require('../middleware/requireAllFields/requiredFields/newsFields');
const userController = require('../controllers/userController');
const newsController = require('../controllers/newsController');
const router = express.Router();

router.use(requireAuth);

router.get('/news', newsController.DisplayNews);
router.post('/news', requireAllFields(fields.addNews), newsController.AddNews);
router.delete('/news', requireAllFields(fields.deleteNews), newsController.DeleteNews);

router.use(userController.ValidateLogin);
module.exports = router;