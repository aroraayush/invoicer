const express = require('express');
const router = express.Router();

router.get('/:id', function(req, res, next) {
    res.render('invoice',{title:'View Invoice',inv_id:req.params.id});
});

module.exports = router;
