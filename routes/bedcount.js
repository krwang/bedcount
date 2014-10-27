var express = require('express');
var utils = require('restberry-utils');
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

router.get('/', function (req, res) {
		res.render('bedcount/homepage', {"shelterName": req.cookies.shelter});
});

router.get('/homepage', function (req, res) {
	var ids = [];
	var result = [];

	Beds.findOne({_id: req.cookies.beds})
		.populate('maleUnits')
		.populate('femaleUnits')
		.populate('neutralUnits')
		.exec(function (err, beds) {
			Occupant.populate(beds, { path: 'maleUnits.occupant'}, function(err, beds) {
				result.push.apply(result, beds.maleUnits);
				result.push.apply(result, beds.femaleUnits);
				result.push.apply(result, beds.neutralUnits);
				res.render('bedcount/homepage', {"shelterName": req.cookies.shelter, "beds": result, "bedObject": beds});
			});
		});
});

router.get('/occupantprofile', function (req, res) {
	res.cookie('commentOn', req.query.name);
	Occupant.findOne({name: req.query.name})
			.populate('currentLoc')
			.exec(function (err, occ) {
				console.log(occ);
				res.render('bedcount/occupantprofile', {occupant: occ});
			});
});

module.exports = router;