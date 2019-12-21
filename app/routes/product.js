const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('products',{title:'Products'});
});

module.exports = router;