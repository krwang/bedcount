var express = require('express');
var router = express.Router();

var models = require('../data-mongoose');
var Shelter = models.Shelter;
var Beds = models.Beds;
var Unit = models.Unit;
var Occupant = models.Occupant;

router.use(function(req, res, next) {
    if(req.cookies.shelter) {
        next();
    } else {
        res.location("/");
        res.redirect("/");
    }
});

/* GET users listing. */
router.get('/bed', function (req, res) {
    Unit.findOne({name: req.query.name})
        .populate("occupant")
        .exec(function(err, unit) {
            console.log(unit);
            res.send({
                success: true,
                unit: unit
            });
        });
});

router.post('/bed', function (req, res) {

    var type = req.body.gender;
    var name = req.body.id;

    Unit.findOne({name: name}, function(err, unit) {
        if (unit) {
            res.send({
                success: false,
                info: "A bed with that name already exists"
            });
        }
        else {
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
                                }
                                else {
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
                        }
                        else {
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
                                console.log(bed);
                                if (err) {
                                    res.send({
                                        success: false,
                                        info: "Error adding new bed"
                                    });
                                }
                                else {
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
                        }
                        else {
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
                                }
                                else {
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
                        }
                        else {
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

router.put('/bed', function (req, res) {
    var occupantName = req.body.occupantName;
    var occupantAge = req.body.occupantAge;

    Occupant.findOne({name: occupantName}, function (err, occ) {
        var newOccupant;
        if (occ) {
            if (req.body.notInTonight == "on") {
                Occupant.update({name: occupantName},
                                { $set: {age: occupantAge, notInDays: occ.notInDays + 1}},
                                function (err, doc) {
                                    newOccupant = occ;
                                });
            }
        }
        else {
            var occupant = new Occupant({name: occupantName, age: occupantAge, daysLeft: 14, notInDays: 0, currentLoc: req.cookies.shelterId});
            occupant.save();
            newOccupant = occupant;
        }
        Unit.update({name: req.body.name}, 
                    { $set: {occupant: newOccupant, occupied: true}}, 
                    function (err, unit) {
                        Unit.findOne({name: req.body.name})
                            .populate("occupant")
                            .exec(function(err, unit) {
                                res.send({
                                    success: true,
                                    unit: unit,
                                });
                            });

        });
    });
});

router.post('/get_beds', function (req, res) {
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

router.get('/updatebed', function (req, res) {
    var bedName = req.query.updateBed;
    Unit.findOne({ name: bedName })
        .populate('occupant')
        .exec(function (err, unit) {
            if (unit.occupant) {
                res.render('shelter/updatebed', {'bedName': bedName, 'occupant': unit.occupant.name, 'age': unit.occupant.age});
            }
            else {
                res.render('shelter/updatebed', {'bedName': bedName, 'occupant': '', 'age': ''});
            }
        });
});

router.post('/updatebed', function (req, res) {
    var occupantName = req.body.occupantName;
    var occupantAge = req.body.occupantAge;

    Occupant.findOne({name: occupantName}, function (err, occ) {
        var newOccupant;
        if (occ) {
            if (req.body.notInTonight == "on") {
                Occupant.update({name: occupantName},
                                { $set: {age: occupantAge, notInDays: occ.notInDays + 1}},
                                function (err, doc) {
                                    newOccupant = occ;
                                });
            }
        }
        else {
            var occupant = new Occupant({name: occupantName, age: occupantAge, daysLeft: 14, notInDays: 0, currentLoc: req.cookies.shelterId});
            occupant.save();
            newOccupant = occupant;
        }
        Unit.update({name: req.body.name}, 
                    { $set: {occupant: newOccupant, occupied: true}}, 
                    function (err, unit) {
                        res.location('/bedcount/homepage');
                        res.redirect('/bedcount/homepage');
        });
    });
});

router.get('/features', function (req, res) {
    Shelter.findOne({shelterName: req.cookies.shelter})
           .populate('beds')
           .exec(function(err, shelter) {
                console.log(shelter);
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
                                        res.location("/bedcount/homepage");
                                        res.redirect("/bedcount/homepage");
                                    });
                   });
});

router.get('/comment', function (req, res) {

    // Consider using req.session
    res.cookie('commentOn', req.query.comment);
    res.render('shelter/comment', {person: req.query.comment});
});

router.post('/comment', function (req, res) {
    var person = req.cookies.commentOn;
    res.clearCookie('commentOn');
    var comment = req.body.comment;

    Occupant.update({name: person}, { $push: {comments: comment}}, function (err, doc) {
        Occupant.findOne({name: person}, function (err, person) {
            res.location("/bedcount/homepage");
            res.redirect("/bedcount/homepage");
        });
    });
});

module.exports = router;
