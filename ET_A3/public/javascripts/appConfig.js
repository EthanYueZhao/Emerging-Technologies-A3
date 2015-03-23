'use strcit';

// main app module
var a3App = angular.module('a3App', ['ngRoute', 'ui.bootstrap', 'DataServices', 'controllers']);

a3App.config(['$routeProvider', function ($routeProvider) {
        
        $routeProvider.
        when('/', {
            templateUrl: 'partials/listView.html',
            controller: 'patientListCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

// all data services
var DataServices = angular.module('DataServices', ['ngResource']);

// in charge of patients data
DataServices.factory('patientsDS', function ($resource) {
    return $resource('patients/:id', null, { 'update': { method: 'PUT' } });
});

// in charge of doctors data
DataServices.factory('doctorsDS', function ($resource) {
    return $resource('doctors/:id', null, { 'update': { method: 'PUT' } });
});

// in charge of search parameters
DataServices.factory('searchDS', function () {
    var patients = {};
    return {
        getList: function () { return patients; },        
        setList: function (list) { patients = list; }
    };
});