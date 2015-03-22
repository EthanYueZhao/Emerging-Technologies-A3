'use strict';

var controllers = angular.module('controllers', []);

var patientListCtrl = controllers.controller('patientListCtrl', function ($scope, patientsDS, searchDS) {
    
    $scope.$on('data', function (event, data) { $scope.patients = data; }); // when recieve broadcast, populate $scope.patients
     
});

var navbarCtrl = controllers.controller('navbarCtrl', function ($scope, patientsDS, $routeParams, searchDS) {
    $scope.searchByLastName = function () {
        
        $scope.$root.$broadcast('data', patientsDS.query({id: $scope.lastName})); // get patients by last name and broadcast to other controllers
        console.log($scope.lastName);
      
    };
   
});

