const express = require('express');
const router = express.Router();
const product = require('./../models/product')
const Product = new product();

/* GET products listing. */
router.get('/all', function(req, res, next) {
    Product.getProducts(req,res);
});

/* GET specific product. */
router.get('/:product_id', function(req, res, next) {
    Product.getProduct(req,res);
});

router.post('/new', function(req, res, next) {
    Product.addProduct(req,res);
});

module.exports = router;
