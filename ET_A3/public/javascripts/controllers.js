'use strict';

var controllers = angular.module('controllers', []);

// patient list controller
var patientListCtrl = controllers.controller('patientListCtrl', function ($scope, patientsDS, $modal) {
    // get patient list by search
    $scope.$on('data', function (event, data) { $scope.patients = data; }); // when recieve broadcast, populate $scope.patients
    
    // delete patient button event
    $scope.deletePatient = function (patient) {
        patientsDS.remove({ id: patient._id });
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
});

// addPatient controller
var addPatientCtrl = controllers.controller('addPatientCtrl', function ($scope, $modalInstance) {
    // page tittle
    $scope.tittle = 'Add a new patient';
    // confirm button text
    $scope.confirmation = 'Add';
    // add button function
    $scope.confirm = function () {
        var patient = {
            _id: $scope.patient._id,
            first_name: $scope.patient.first_name,
            last_name: $scope.patient.last_name,
            age: $scope.patient.age,
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
var updatePatientCtrl = controllers.controller('updatePatientCtrl', function ($scope, $modalInstance, patient) {
    // page tittle
    $scope.tittle = 'Update a patient';
    // confirm button text
    $scope.confirmation = 'Update';
    // display patient information
    $scope.patient = patient;
    // update button function
    $scope.confirm = function () {
        var patient = {
            _id: $scope.patient._id,
            first_name: $scope.patient.first_name,
            last_name: $scope.patient.last_name,
            age: $scope.patient.age,
            created_at: new Date().toJSON()
        };
        $modalInstance.close(patient);
    };
    // cancel button function
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});

// navbar controller
var navbarCtrl = controllers.controller('navbarCtrl', function ($scope, patientsDS) {
    
    $scope.searchByLastName = function () {
        $scope.$root.$broadcast('data', patientsDS.query({ id: $scope.lastName })); // get patients by last name and broadcast to other controllers
    };
   
});

