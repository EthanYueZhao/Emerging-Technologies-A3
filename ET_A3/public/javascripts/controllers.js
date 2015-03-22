'use strict';

var patientListCtrl = a3App.controller('patientListCtrl', function ($scope, patientsDS, searchDS) {
    //var list = searchDS.getList();
    //console.log('list+++++' + list);
    
    //if (list != null)
    //{
    //    $scope.patients = list;
    //}
    $scope.$watch(function () { return searchDS.getList(); });
    console.log('listCtrl+++++' );
    console.log(searchDS.getList());
    $scope.patients = searchDS.getList();
   // $scope.patients = patientsDS.query();
        
});

var navbarCtrl = a3App.controller('navbarCtrl', function ($scope, patientsDS, searchDS) {
    $scope.searchByLastName = function () {
        //searchDS.searchPara.para = $scope.lastName;
        //console.log(searchDS.searchPara.para); 
        searchDS.setList(patientsDS.query());
        console.log('navbarCtrl+++++' + searchDS.getList());
        console.log(searchDS.getList());
    };
   
});

