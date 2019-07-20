module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `category` ORDER BY id ASC";

        //execute query
        db.query(query, (err, categories) => {
            if(err) {
                res.redirect('/');
            }
            res.render('pages/index.ejs', {
                title: "Welcome to squad | view players",
                category: categories 
            })
        })
    }
}