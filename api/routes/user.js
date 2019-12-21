const express = require('express');
const router = express.Router();
const user = require('./../models/user')
const User = new user();

router.post('/login', function(req, res) {
    User.loginUser(req,res);
});
router.get('/logout', function(req, res) {
    User.logoutUser(req,res);
});

router.post('/register', function(req, res) {
    User.addUser(req,res);
});

module.exports = router;
