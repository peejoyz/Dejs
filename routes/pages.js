var express = require('express');
var router = express.Router();

// Get /
router.get('/', function(req, res){
    res.render('pages/index', {
        title : "Welcome to dejstore"
    });
});

router.get('/contact', function(req,res) {
    res.render('pages/contact');
});

router.get('/about', function(req,res) {
    res.render('pages/about');
});
   
router.get('/buynow', function(req,res) {
    res.render('buynow');
});


module.exports = router;