const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister);

router.route('/login')
    .get(users.renderLogin);

module.exports = router;