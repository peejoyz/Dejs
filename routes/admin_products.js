
var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');

//var Product = "SELECT * FROM `products` ORDER BY id ASC";

//var Category = "SELECT * FROM `category` ORDER BY id ASC";

//Get products index
router.get('/', function(req, res) {

    //     var Product;

    //     var count;  

    //   Product.count(function (err, c) {
    //       count = c;
    //   });

    let query = "SELECT * FROM `products` ORDER BY id ASC";
    
        db.query(query, (err, prods) => {
            if(err) 
                return console.log(err);
                res.render('admin/products', {
                    products: prods
                    //count: count
                });
        });
});



//Get add product
router.get('/add-product', function(req, res){
    var title = '';
    var desc = '';
    var price = '';

    let categoryQuery = "SELECT * FROM `category` ORDER BY id ASC";
        db.query(categoryQuery, (err, results) => {
            if(err)
                console.log(err);

            res.render('admin/add_product',{
                title : title,
                desc : desc,
                category : results,
                price : price 
            });
        })
       
});

//Post add product
router.post('/add-product', function(req, res){

        var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

        req.checkBody('title', 'Title must have a value').notEmpty();
        req.checkBody('desc', 'Description must have a value.').notEmpty();
        req.checkBody('price', 'Price must have a value.').isDecimal();
        req.checkBody('image', 'You must upload an image').isImage(imageFile);

        var title = req.body.title;
        var slug = title.replace(/\s+/g, '-').toLowerCase();
        var desc = req.body.desc;
        var price = req.body.price;
        var category = req.body.category;
        
        var errors = req.validationErrors();

        if (errors) {
                let categoryQuery = "SELECT * FROM `category` ORDER BY id ASC";
                db.query(categoryQuery, (err, results) => {
                if(err)
                    console.log(err);

                res.render('admin/add_product',{
                    errors : errors,
                    title : title,
                    desc : desc,
                    category : results,
                    price : price 
                });
            })
        } else {

            let query = "SELECT FROM `products` WHERE slug = '" + slug + "'";

            db.query(query, (err, prods) => {

                if(prods) {
                    req.flash('danger', 'Product title exists, choose another.')
                    
                    let query = "SELECT * FROM `category` ORDER BY id ASC";
                    db.query(query, (err, results) => {
                        res.render('admin/add_product', {
                            title : title,
                            desc : desc,
                            category : results,
                            price : price
                        });
                    });
                } else {

                    var price2 = parseFloat(price).toFixed(2);

                    let query = "INSERT INTO `products` (title, slug, desc, price, category, image) VALUES ('" +
                            title + "', '" + slug + "', '" + desc + "', '" + price2 + "', '" + category + "', '" + imageFile + "')";

                    db.query(query, (err, prods) => {
                        if(err)
                            return console.log(err);

                            mkdirp('public/product_images/' + product._id, function(err) {
                                return console.log(err);
                            });

                            mkdirp('public/product_images/' + product._id + '/gallery', function(err) {
                                return console.log(err);
                            });

                            mkdirp('public/product_images/' + product._id + '/gallery/thumbs', function(err) {
                                return console.log(err);
                            });

                            if (imageFile != ""){
                                var productImage = req.files.image;
                                var path = 'public/product_images/' + product._id + '/' + imageFile;

                                productImage.mv(path, function(err) {
                                    return console.log(err);
                                });
                            }

                            req.flash('success', 'Product added!');
                            res.redirect('/admin/products');
                                
                    });
                }

            });
        }
})


module.exports = router;