var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index.html');
});

// connect to local DB
mongoose.connect('mongodb://127.0.0.1:27017/ETA3DB');
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
    name: String
});

var patients = mongoose.model('patients', PatientSchema);
var doctors = mongoose.model('doctors', DoctorSchema);

// APIs++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// get patients by parameter
router.get('/patients/:id', function (req, res) {
    // find patients by last name from db
    patients.find({ last_name: req.params.id }, function (err, patients) {
        if (err) console.log("error");
        res.json(patients);
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

module.exports = router;