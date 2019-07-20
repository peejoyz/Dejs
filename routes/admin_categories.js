
var express = require('express');
var router = express.Router();

// Get category index
router.get('/', function(req, res){
    let query = "SELECT * FROM `category` ORDER BY id ASC";
        db.query(query, (err, results) => {
            if(err) 
                return console.log(err);
                res.render('admin/categories', {
                    category: results
             });
        });
});



//Get add category

router.get('/add-category', function(req, res) {

    var title = req.body.title;
    
    res.render('admin/add_category', {
        title : title
    });
});


//Post add category
router.post('/add-category', function(req, res) {
   
    req.checkBody('title', 'Title must have a value').notEmpty();
    
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors : errors,
            title : title
        });
    } else {
        var titleQuery = "SELECT * FROM `category` WHERE title = '" + title + "'";

        db.query(titleQuery, (err, results) => {
            if (err) {
                return console.log(err);
            }
            
            if(results.length > 0) {
                req.flash('danger', 'category title exists, choose another.');
                res.render('admin/add_category', {
                    errors : errors,
                    title : title
                });
            } else {
               let query = "INSERT INTO `category` (title) VALUES ('" + title + "')";
                db.query(query, (err, results) => {
                    if(err) {
                        return console.log(err);
                    } 

                    let query = "SELECT * FROM `category` ORDER BY id ASC";

                    db.query(query, (err, results) => {

                        if (err) {
                        return console.log(err);

                        } 
                        else {
                                req.app.locals.category = results;
                        }
                        req.flash('success', 'category added');
                        res.redirect('/admin/categories');
                    })
                })
            }
        })
    }
   
});


//Get Edit category

router.get('/edit-category/:id', function(req, res) {

    let id = req.params.id;
    
    let idquery = "SELECT * FROM `category`  WHERE id = '" + id + "'";
    
    db.query(idquery, (err, category) => {
        if(err)
        return console.log(err);

        res.render('admin/edit_category', {
            title : category.title,
            category: category[0],
            id: category._id
        })
    })
});


//Post edit category

router.post('/edit-category/:id', function(req, res) {
   
    req.checkBody('title', 'Title must have a value').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
   
    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title : title,
            //id: category.id
        });
    } else  {

                        let categoryId = req.params.id;
                        let title = req.body.title;
                        let slug = title.replace(/\s+/g, '-').toLowerCase();
                        
                        let query = "UPDATE `category` SET `title` = '" + title + "', `slug` = '" + slug + "' WHERE `category`.`id` = '" + categoryId + "'";
                            
                                db.query(query, (err, result) => {
                                    if(err)
                                        return console.log(err);

                                        req.flash('success', 'Category edited!');
                                        res.redirect('/admin/categories/edit-category/' + categoryId);
                                });                           

                        
                    
            }
    
});

// Get deleted pages
router.get('/delete-category/:id', function(req, res){
        let categoryId = req.params.id;
        let deleteUserQuery = 'DELETE FROM category WHERE id = "' + categoryId + '"';
        db.query(deleteUserQuery, (err, result) => {
            if (err)
                return console.log(err)
        })

        req.flash('success', 'Category deleted successfully');
        res.redirect('/admin/categories/');
   
});

module.exports = router;