
var express = require('express');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var ExpressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var app = express();


//create connection to database
var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'shopping'
});

//connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('connected to database');
});

global.db = db;


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

//set global errors variable 
app.locals.errors = null;


//Express fileUpload middleware
app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express Session
app.use(session({
	secret: 'mysecretsessionkey',
	resave: true,
	saveUninitialized: true
	//cookie : { secure: true }
}));


//Express validator
app.use(ExpressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam +='[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function(value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages') (req, res);
    next();
});


// set routes
var pages = require('./routes/pages.js');
var products = require('./routes/products.js');
//var cart = require('./routes/cart.js');
//var users = require('./routes/users.js');
//var adminpages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminProducts = require('./routes/admin_products.js');

//app.use('/admin/pages', adminpages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/products', products);
// app.use('/cart', cart);
// app.use('/users', users);
app.use('/', pages);

var port = 5050;

app.set('port', process.env.port || port);

app.listen(port, () => {
    console.log(`Live on port: ${port}`);
})
