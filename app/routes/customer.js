const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('customers',{title:'Customers'});
});

module.exports = router;
