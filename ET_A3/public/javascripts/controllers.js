'use strict';

var patientListCtrl = a3App.controller('patientListCtrl', ['$scope', 'patientsDS', 
    function ($scope, patientsDS) {
        $scope.patients = patientsDS.query();
    }
]);

