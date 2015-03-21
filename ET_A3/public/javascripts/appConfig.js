'use strcit';

// main app module
var a3App = angular.module('a3App', ['ngRoute', 'ui.bootstrap', 'DataServices']);

a3App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
      when('/', {
            templateUrl: 'partials/listView.html',
            controller: 'patientListCtrl'
        }).
     
      otherwise({
            redirectTo: '/'
        });
    }]);

// all data services

var DataServices = angular.module('DataServices', ['ngResource']);

// in charge of patients data
DataServices.factory('patientsDS', ['$resource', 
    function ($resource) {
        return $resource('patients/:id', null, { 'update': { method: 'PUT' } });
    }]);

// in charge of doctors data
DataServices.factory('doctorsDS', ['$resource', 
    function ($resource) {
        return $resource('doctors/:id', null, { 'update': { method: 'PUT' } });
    }]);

// in charge of issuses
//DataServices.factory('IssueDS', ['$resource', 
//    function ($resource)
//    {
//        return $resource('IssueAPI/:id', null, { 'update': { method: 'PUT' } });

//    }]);