const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('invoices',{title:'Invoices'});
});

module.exports = router;
