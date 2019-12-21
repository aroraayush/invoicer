const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login')
});

router.get('/login', function(req, res, next) {
  res.render('login',{title:'Invoicer - Login'});
});

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Invoicer - Register'});
});

module.exports = router;
