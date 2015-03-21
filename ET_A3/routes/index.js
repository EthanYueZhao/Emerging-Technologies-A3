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

var Patient = mongoose.model('Patient', PatientSchema);

// APIs++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/d', function (req, res) {
    Patient.findById("p001", function (err, docs) {
        if (err)
            console.log("error");
        
        console.log("-------------------");
        console.log(docs);
        res.json(docs);
    });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = router;