'use strict';

var controllers = angular.module('controllers', []);

// patient list controller
var patientListCtrl = controllers.controller('patientListCtrl', function ($scope, patientsDS, searchDS, $modal, $q) {
    // get all patients by search
    $scope.list = [];
    // if value of list changes, list will get new value
    $scope.$watch('list', function (newV, oldV) {
        $scope.list = newV;
        $scope.totalItems = $scope.list.length;
        
        var start = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = start + $scope.itemsPerPage;
        
        $scope.patients = $scope.list.slice(start, end);// populate patient list
    });
    
    $scope.$on('data', function (event, data) {
        
        data.$promise.then(function (v) {
            $scope.list = v;// when recieve broadcast, populate $scope.list
        });
    });
    
    // delete patient button event
    $scope.deletePatient = function (patient) {
        patientsDS.remove({ id: patient._id });
       // $scope.list.pop(patient);
       
    };
    
    // update patient button event
    $scope.updatePatient = function (patient) {
        // pop up a window
        var patientInstance = $modal.open({
            templateUrl: 'partials/patientDetail.html',
            controller: 'updatePatientCtrl',
            resolve: {
                patient: function () {
                    return patient;
                }
            }
        });
        
        // pop-up window closed
        patientInstance.result.then(
            // confirmed fuction of pop-up window
            function (patient) {
                patientsDS.update({ id: patient._id }, patient);
                console.info(patient);
            }, 
            // dismissed function of pop-up window
            function () {
                console.log("cancel");
            });
    };
    
    // add new patient button event
    $scope.openAddView = function () {
        
        // pop up a window
        var patientInstance = $modal.open({
            
            templateUrl: 'partials/patientDetail.html',
            controller: 'addPatientCtrl',
        });
        
        // pop-up window closed
        patientInstance.result.then(
            // confirmed fuction of pop-up window
            function (patient) {
                patientsDS.save(patient);
                console.info(patient);
            }, 
            // dismissed function of pop-up window
            function () {
                console.log("cancel");
            });
    };
    
    // pagination setup    
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1; // current page
    
    // page changed function
    $scope.$watch('currentPage + itemsPerPage', function () {
        var start = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = start + $scope.itemsPerPage;
        
        // display current list
        $scope.patients = $scope.list.slice(start, end);        
    });


});

// addPatient controller
var addPatientCtrl = controllers.controller('addPatientCtrl', function ($scope, $modalInstance, doctorsDS) {
    // page tittle
    $scope.tittle = 'Add a new patient';
    
    // enable id input
    $scope.isDisabled = false;
    
    // get all doctors
    $scope.doctors = doctorsDS.query();
    
    // confirm button text
    $scope.confirmation = 'Add';
    
    // add button function
    $scope.confirm = function () {
        var patient = {
            _id: $scope.patient._id,
            first_name: $scope.patient.first_name,
            last_name: $scope.patient.last_name,
            age: $scope.patient.age,
            family_doctor_ID: $scope.doctorId,
            created_at: new Date().toJSON()
        };
        $modalInstance.close(patient);
    };
    
    // cancel button function
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});

// updatePatient controller
var updatePatientCtrl = controllers.controller('updatePatientCtrl', function ($scope, $modalInstance, patient, doctorsDS) {
    // page tittle
    $scope.tittle = 'Update a patient';
    
    // get all doctors
    $scope.doctors = doctorsDS.query();
    
    // disable id input
    $scope.isDisabled = true;
    
    // confirm button text
    $scope.confirmation = 'Update';
    
    // display patient information
    $scope.patient = patient;
    
    // display default family doctor
    $scope.doctorId = patient.family_doctor_ID;
    
    // update button function
    $scope.confirm = function () {
        var patient = {
            _id: $scope.patient._id,
            first_name: $scope.patient.first_name,
            last_name: $scope.patient.last_name,
            age: $scope.patient.age,
            family_doctor_ID: $scope.doctorId,
            last_modified: new Date().toJSON()
        };
        $modalInstance.close(patient);
    };
    
    // cancel button function
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});

// navbar controller
var navbarCtrl = controllers.controller('navbarCtrl', function ($scope, patientsDS, doctorsDS, searchDS) {
    // search by last name button event
    $scope.searchByLastName = function () {
        $scope.$root.$broadcast('data', patientsDS.query({ id: $scope.lastName })); // get patients by last name and broadcast to other controllers
        searchDS.setList(patientsDS.query({ id: $scope.lastName }));
    };
    
    // show all paitents button event
    $scope.showPatientList = function () {
        $scope.$root.$broadcast('data', patientsDS.query()); // get all patients and broadcast to other controllers
    };
    
    // get all doctors
    $scope.doctors = doctorsDS.query();
    
    // search by doctor button event
    $scope.searchByDoctor = function () {
        $scope.$root.$broadcast('data', patientsDS.query({ id: $scope.doctorId })); // get patients by doctor name and broadcast to other controllers
    };
   
});

// doctor signup controller
var signUpCtrl = controllers.controller('signUpCtrl', function ($scope, doctorsDS) {

    $scope.signUp = function () {
        var doctor = {
            name: $scope.name,
            username: $scope.username,
            password: $scope.password
        };
    
        doctorsDS.save(doctor);
        console.log(doctor);
    }
});
