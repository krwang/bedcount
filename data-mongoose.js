var mongoose = require('mongoose');

var shelterSchema = mongoose.Schema({
	shelterName: String,
	password: String,
	address: String,
	email: String,
	phoneNumber: String,
	beds: {type: mongoose.Schema.Types.ObjectId, ref: 'Beds'},
	drinking: Boolean
});

var bedSchema = mongoose.Schema({
	numberMale: Number,
	numberFemale: Number,
	numberNeutral: Number,
	maleUnits: [{type: mongoose.Schema.Types.ObjectId, ref: 'Unit'}],
	femaleUnits: [{type: mongoose.Schema.Types.ObjectId, ref: 'Unit'}],
	neutralUnits: [{type: mongoose.Schema.Types.ObjectId, ref: 'Unit'}]
});

var unitSchema = mongoose.Schema({
	type: String,
	name: String,
	occupied: { type: Boolean, default: false },
	occupant: {type: mongoose.Schema.Types.ObjectId, ref: 'Occupant'}
});

var occupantSchema = mongoose.Schema({
	name: String,
	age: Number,
	daysLeft: { type: Number, default: 14},
	notInDays: { type: Number, default: 0 },
	comments: [String],
	currentLoc: {type: mongoose.Schema.Types.ObjectId, ref: 'Shelter'},
	previousLoc: [{type: mongoose.Schema.Types.ObjectId, ref: 'Shelter'}]
});

var Shelter = mongoose.model('Shelter', shelterSchema);
var Beds = mongoose.model('Beds', bedSchema);
var Unit = mongoose.model('Unit', unitSchema);
var Occupant = mongoose.model('Occupant', occupantSchema);

exports.Shelter = Shelter;
exports.Beds = Beds;
exports.Unit = Unit;
exports.Occupant = Occupant;