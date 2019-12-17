const express = require('express');
const router = express.Router();
const UsersController = require('./../controllers/users_controller');

router.get('/register', UsersController.register);
router.post('/register', UsersController.createUser);
router.get('/public', (req, res) => { res.send('Public page') });
router.get('/private', (req, res) => { res.send('Private page') });

module.exports = router;