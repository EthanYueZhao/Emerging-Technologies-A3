var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
var app = express();



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
    _id: Schema.ObjectId,
    name: String,
    username: String,
    password: String
});

DoctorSchema.plugin(passportLocalMongoose);

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

// post a new doctor
router.post('/doctors', function (req, res) {
    var doctor = new doctors(req.body);
    doctor.set({_id: mongoose.Types.ObjectId()});
    doctor.save(function (err) {
        if (err) console.log('err when save'+err);
        console.log('doctor saved');
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

// login authentication
router.post('/login', passport.authenticate('local', {
    successRedirect: '/#/patientList',
    failureRedirect: '/#/signup'
})
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function (username, password, done) {
    process.nextTick(function () {
        doctors.findOne({
            'username': username, 
        }, function (err, user) {
            if (err)
            {
                return done(err);
            }
            
            if (!user)
            {
                return done(null, false);
            }
            
            if (user.password != password)
            {
                return done(null, false);
            }
            
            return done(null, user);
        });
    });
}));


module.exports = router;