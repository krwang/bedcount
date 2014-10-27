var express = require('express');
var router = express.Router();

var models = require('../data-mongoose');
var Shelter = models.Shelter;
var Beds = models.Beds;
var Unit = models.Unit;
var Occupant = models.Occupant;

/* GET methods */

router.get('/', function (req, res) {
    // if (req.cookies.user == undefined || req.cookies.password == undefined){
        res.render('landingpage');
    // }
  	// else{
        // res.redirect('bedcount/homepage');
    // }
});

router.get('/landingpage', function (req, res) {
	res.render('/landingpage');
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/signup', function (req, res) {
    res.render('signup');
});

/* 
    POST method for when a user logs in. Stores user info into
    a cookie and redirects to the homepage if login is successful
*/
router.post('/login', function(req, res) {
    var shelterName = req.body.sheltername;
    var password = req.body.password;

    Shelter.findOne({shelterName: shelterName}, function (err, doc) {
        if (err) {
            res.send({
                success: false,
                info: "An error occurred"
            });
        }
        else if (doc) {
            // Authenticate with simple password check
            if (doc.password == password) {

                // Save user data into cookie and redirect to twitter
                res.cookie('shelter', shelterName);
                res.cookie('password', password);
                res.cookie('beds', doc.beds);
                res.cookie('shelterId', doc._id);
                res.send({
                    url: '/bedcount/homepage',
                    success: true
                });
            }
            else {
                res.send({
                    success: false,
                    info: "The sheltername or password is incorrect"
                });
            }
        }
        else {
            res.send({
                success: false,
                info: "The sheltername or password is incorrect"
            });
        }
    });
})

/* POST to Add User Service */
router.post('/signup', function(req, res) {

    // Get our form values. These rely on the "name" attributes
    var shelterName = req.body.sheltername;
    var password = req.body.password;
    var email = req.body.email;
    var phoneNumber = req.body.phoneNumber;

    // If there is no account with username, the find should return a null doc
    Shelter.findOne({shelterName: shelterName}, function (err, doc) {
        if (err) {
            res.send({
                info: "There was a problem adding the information to the database.",
                success: false
            });
        }
        else if (doc) {
            res.send({
                info: "An account already exists with that username.",
                success: false
            });
        }
        else {

            // Create documents for tweets and following in their respective models
            // and bind the references to the new account document
            var beds = new Beds({numberMale: 0, numberFemale: 0, numberNeutral: 0, maleUnits: [], femaleUnits: [], neutralUnits: []});
            beds.save();
            var account = new Shelter({shelterName: shelterName, address: '', password: password, email: email, phoneNumber: phoneNumber, beds: beds});
            account.save(function (err, doc) {
                if (err) {
                    res.send({
                        info: "An error occured when creating a new account",
                        success: false,
                    });
                }
                else {
                     // Save user data in cookie and 
                     // redirect to the user homepage
                    res.cookie('shelter', shelterName);
                    res.cookie('password', password);
                    res.cookie('beds', beds._id);
                    res.cookie('shelterId', doc._id);
                    res.send({
                        url: '/shelter/features',
                        success: true
                    });                  
                }
            });
        }
    });  
});

/*
    POST method for logging out. Clears the cookies
    and returns the user to the landing page
*/
router.post('/logout', function(req, res) {
    res.clearCookie('shelter');
    res.clearCookie('password');
    res.clearCookie('beds');
    res.clearCookie('shelterId');
    res.send({
        url: '/',
        success: true
    });
});

module.exports = router;
