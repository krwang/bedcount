var express = require('express');
var router = express.Router();

var models = require('../data-mongoose');
var Shelter = models.Shelter;
var Beds = models.Beds;
var Unit = models.Unit;
var Occupant = models.Occupant;

router.use(function(req, res, next) {
    if (req.cookies.shelter) {
        next();
    } else {
        res.location("/");
        res.redirect("/");
    }
});

router.get('/', function (req, res) {
    Shelter.findOne({shelterName: req.cookies.shelter})
           .populate("beds")
           .exec(function(err, shelter) {
                if (shelter) {
                    res.send({
                        success: true,
                        shelter: shelter
                    });
                } else {
                    res.send({
                        success: false,
                        info: "An error occured"
                    });
                }
           });
});

/* GET users listing. */
router.get('/beds/:name', function (req, res) {
    Unit.findOne({name: req.params.name})
        .populate("occupant")
        .exec(function(err, unit) {
            res.send({
                success: true,
                unit: unit
            });
        });
});

router.post('/beds/:name', function (req, res) {

    var type = req.body.gender;
    var name = req.params.name;

    Unit.findOne({name: name}, function(err, unit) {
        if (unit) {
            res.send({
                success: false,
                info: "A bed with that name already exists"
            });
        } else {
            var none = new Occupant({name: "None", age: 0, daysLeft: 0});
            none.save();
            var unit = new Unit({type: type, name: name, occupied: false, occupant: none});
            unit.save();
            switch(type) {
                case "male":
                    Beds.findOne({_id: req.cookies.beds}, function(err, beds) {
                        if (beds.maleUnits.length < beds.numberMale) {
                            beds.maleUnits.push(unit._id);  
                            beds.save(function(err, bed) {
                                if (err) {
                                    res.send({
                                        success: false,
                                        info: "Error adding new bed"
                                    });
                                } else {
                                    Unit.findOne({_id: unit._id})
                                        .populate("occupant")
                                        .exec(function(err, bed) {
                                            res.send({
                                                success: true,
                                                bed: bed,
                                            });
                                        });
                                }
                            });
                        } else {
                            res.send({
                                success: false,
                                info: "Reached Maximum Beds"
                            });
                        }
                    });
                    break;
                case "female":
                    Beds.findOne({_id: req.cookies.beds}, function(err, beds) {
                        if (beds.femaleUnits.length < beds.numberFemale) {
                            beds.femaleUnits.push(unit._id);  
                            beds.save(function(err, bed) {
                                if (err) {
                                    res.send({
                                        success: false,
                                        info: "Error adding new bed"
                                    });
                                } else {
                                    Unit.findOne({_id: unit._id})
                                        .populate("occupant")
                                        .exec(function(err, bed) {
                                            res.send({
                                                success: true,
                                                bed: bed,
                                            });
                                        });
                                }
                            });
                        } else {
                            res.send({
                                success: false,
                                info: "Reached Maximum Beds"
                            });
                        }
                    }); 
                    break;
                case "neutral":
                    Beds.findOne({_id: req.cookies.beds}, function(err, beds) {
                        if (beds.neutralUnits.length < beds.numberNeutral) {
                            beds.neutralUnits.push(unit._id);  
                            beds.save(function(err, bed) {
                                if (err) {
                                    res.send({
                                        success: false,
                                        info: "Error adding new bed"
                                    });
                                } else {
                                    Unit.findOne({_id: unit._id})
                                        .populate("occupant")
                                        .exec(function(err, bed) {
                                            res.send({
                                                success: true,
                                                bed: bed,
                                            });
                                        });
                                }
                            });
                        } else {
                            res.send({
                                success: false,
                                info: "Reached Maximum Beds"
                            });
                        }
                    });
            }
        }
    });
     
});

router.put('/beds/:name', function (req, res) {
    var occupantName = req.body.occupantName;
    var occupantAge = req.body.occupantAge;

    Occupant.findOne({name: occupantName}, function (err, occ) {
        var newOccupant;
        if (occ) {
            var notIn;
            if (req.body.notInTonight == "off") {
                notIn = occ.notInDays + 1;
            } else {
                notIn = occ.notInDays;
            }
            Occupant.update({name: occupantName},
                            { $set: {age: occupantAge, notInDays: notIn}},
                            function (err, doc) {
                                newOccupant = occ;
                                Unit.update({name: req.params.name}, 
                                    { $set: {occupant: newOccupant, occupied: true}}, 
                                    function (err, unit) {
                                        Unit.findOne({name: req.params.name})
                                            .populate("occupant")
                                            .exec(function(err, unit) {
                                                res.send({
                                                    success: true,
                                                    unit: unit,
                                                });
                                            });
                                    });
                            });
        } else {
            var occupant = new Occupant({name: occupantName, age: occupantAge, daysLeft: 14, notInDays: 0, currentLoc: req.cookies.shelterId});
            occupant.save();
            Unit.update({name: req.params.name}, 
                        { $set: {occupant: occupant, occupied: true}}, 
                        function (err, unit) {
                            Unit.findOne({name: req.params.name})
                                .populate("occupant")
                                .exec(function(err, unit) {
                                    res.send({
                                        success: true,
                                        unit: unit,
                                    });
                                });
            });
        }
    });
});

router.get('/beds', function (req, res) {
    var result = {"beds": []};
    var opts = [{path: 'maleUnits.occupant'}, 
                {path: 'femaleUnits.occupant'}, 
                {path: 'neutralUnits.occupant'}];

    Beds.findOne({_id: req.cookies.beds})
        .populate('maleUnits')
        .populate('femaleUnits')
        .populate('neutralUnits')
        .exec(function (err, beds) {
            Occupant.populate(beds, opts, function(err, beds) {
                result.beds.push.apply(result.beds, beds.maleUnits);
                result.beds.push.apply(result.beds, beds.femaleUnits);
                result.beds.push.apply(result.beds, beds.neutralUnits);
                res.send({
                    success: true,
                    beds: result
                });
            });
        });
});

router.get('/features', function (req, res) {
    Shelter.findOne({shelterName: req.cookies.shelter})
           .populate('beds')
           .exec(function(err, shelter) {
                res.render('shelter/features', {address: shelter.address, 
                                                    beds: shelter.beds});
            });

});

router.post('/features', function (req, res) {

    var address = req.body.address;
    var numberMale = req.body.numberMale;
    var numberFemale = req.body.numberFemale;
    var numberNeutral = req.body.numberNeutral;
    // var drinking = req.body.sober == "true" ? true : false;

    Shelter.update( {shelterName: req.cookies.shelter}, 
                    { $set: {address: address}},
                    function(err, shelter) {
                        Beds.update({_id: req.cookies.beds},
                                    { $set: {numberMale: numberMale,
                                             numberFemale: numberFemale,
                                             numberNeutral: numberNeutral}},
                                    function(err, beds) {
                                        res.cookie('address', address);
                                        // res.send({
                                        //     success: true
                                        // });
                                        res.location('/bedcount/homepage');
                                        res.redirect('/bedcount/homepage');
                                    });
                   });
});

router.get('/comment', function (req, res) {

    // Consider using req.session
    res.cookie('commentOn', req.query.comment);
    res.render('shelter/comment', {person: req.query.comment});
});

router.post('/comment', function (req, res) {
    // var person = req.cookies.commentOn;
    // res.clearCookie('commentOn');
    var person = req.body.occupant;
    var comment = req.body.comment;

    Occupant.update({name: person}, { $push: {comments: comment}}, function (err, doc) {
        Occupant.findOne({name: person}, function (err, person) {
            // res.location("/bedcount/homepage");
            // res.redirect("/bedcount/homepage");
            if (person) {
                res.send({
                    success: true,
                });
            } else {
                res.send({
                    success: false
                });
            }
        });
    });
});

router.get('/occupant/:name', function (req, res) {
    Occupant.findOne({name: req.params.name})
            .populate('currentLoc')
            .exec(function(err, person) {
                if (person) {
                    res.send({
                        success: true,
                        occupant: person
                    });
                } else {
                    res.send({
                        success: false,
                        info: "An error occured"
                    });
                }
            });
});

module.exports = router;
