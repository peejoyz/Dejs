var express = require('express');
var router = express.Router();
var fs = require('fs-extra');


var Product = "SELECT * FROM `products` ORDER BY id ASC";

var Category = "SELECT * FROM `category` ORDER BY id ASC";


//Get all products
router.get('/', function(req, res) {
    let Product = "SELECT * FROM `products` ORDER BY id ASC";
    db.query(Product, (err, result) => {
        if(err)
            console.log(err);

            res.render('all_products', {
                title: 'All products',
                products: result
            })
    });
});

router.get('/', function(req, res) {
    let Product = "SELECT * FROM `products` ORDER BY id ASC";
    db.query(Product, (err, result) => {
        if(err)
            console.log(err);

            res.render('index',{
                title: 'All products',
                products: result
            });
    });
});


//Get products by category
router.get('/:category', function(req, res) {
    var categorySlug = req.params.category;

    let slugQuery = "SELECT * FROM `category` WHERE slug = '" + categorySlug + "'";
    db.query(slugQuery, (err, c) => {
        let Product = "SELECT * FROM `products` WHERE category = '" + categorySlug + "'";
        db.query(Product, (err, products) => {
            if(err)
                console.log(err);

                res.render('all_products', {
                    title: 'All products',
                    products: products
                });
        })
    })

})


module.exports = router;