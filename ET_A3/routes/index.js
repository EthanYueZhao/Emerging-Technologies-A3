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
    name:String
});

var patients = mongoose.model('patients', PatientSchema);
var doctors = mongoose.model('doctors', DoctorSchema);

// APIs++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/patients', function (req, res) {

    patients.find(function (err, patients) {
        if (err)
            console.log("error");
              
        console.log(patients);
        res.json(patients);
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = router;