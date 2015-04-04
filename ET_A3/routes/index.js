﻿var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = express();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index.html');
});

// connect to local DB
mongoose.connect('mongodb://eta3:eta3@ds041167.mongolab.com:41167/eta3db'); // mongoLab connection
//mongoose.connect('mongodb://MongoLab-et:LHbImFE5KZmkG9q0GAHOmcY1URW9vR5g_wW.SPH99yo-@ds045097.mongolab.com:45097/MongoLab-et'); // Azure connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('db connected successfully!');
});

var PatientSchema = new Schema({
    _id: String,
    first_name: String,
    last_name: String,
    visits: [VisitSchema],
    age: Number,
    family_doctor_ID: String,
    created_at: String,
    last_modified: String
});

var VisitSchema = new Schema({
    _id: String,
    complaint: String,
    billing_amt: String
});

var DoctorSchema = new Schema({
    _id: String,
    name: String,
    username: String,
    password: String
});

var patients = mongoose.model('patients', PatientSchema);
var doctors = mongoose.model('doctors', DoctorSchema);

// APIs++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// get all doctors
router.get('/doctors', function (req, res) {
    // find all patients from db
    doctors.find(function (err, doctors) {
        if (err) console.log("error");
        res.json(doctors);
    });
});

// get all patient list
router.get('/patients', function (req, res) {
    // find all patients from db
    patients.find(function (err, patients) {
        if (err) console.log("error");
        res.json(patients);
    });
});

// get patients by parameter
router.get('/patients/:id', function (req, res) {
    // find patients by last name from db
    patients.find({ last_name: req.params.id }, function (err, patients) {
        if (err) console.log("error");
        if (patients.length !== 0) res.json(patients);
    });
    
    // find patients by doctor id from db
    patients.find({ family_doctor_ID: req.params.id }, function (err, patients) {
        if (err) console.log("error");
        if (patients.length !== 0) res.json(patients);
    });
});

// post new patient
router.post('/patients', function (req, res) {
    var patient = new patients(req.body);
    
    patient.save(function (err) {
        if (err) console.log('err when save');
        console.log('patient saved');
    });
});

// delete a patient by _id
router.delete('/patients/:id', function (req, res) {
    patients.remove({
        _id: req.params.id
    }, function (err) {
        if (err) console.log('err when remove');
        console.log('Successfully deleted');
    });
});

// update a patient by _id
router.put('/patients/:id', function (req, res) {
    var patient = new patients(req.body);
    
    patients.findOneAndUpdate({ _id: patient._id }, patient, function (err) {
        if (err) console.log("err when update");
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



app.use(passport.initialize());
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
},
    function (username, password, done) {
        doctors.findOne({ username: username }, function (err, user) {
            if (err)
            { return done(err); }
            if (!user)
            {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password))
            {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/patientList',
    failureRedirect: '/login',
    failureFlash: true
})
);

module.exports = router;