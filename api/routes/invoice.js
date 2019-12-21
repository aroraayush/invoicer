const express = require('express');
const router = express.Router();
const invoice = require('./../models/invoice')
const Invoice = new invoice();

/* GET invoices for a user */
router.get('/all', function(req, res, next) {
    Invoice.getInvoices(req,res);
});

/* GET specific invoice. */
router.get('/:invoice_id', function(req, res, next) {
    Invoice.getInvoice(req,res);
});

/* DELETE specific invoice. */
router.delete('/:invoice_id', function(req, res, next) {
    Invoice.deleteInvoice(req,res);
});

router.post('/new', function(req, res, next) {
    Invoice.addInvoice(req,res);
});

module.exports = router;
