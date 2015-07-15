'use strict';
app.controller("testCtrl",['$scope', '$location', '$routeParams', 'TestFactory','LookupFactory','$filter',
    function($scope, $location, $routeParams, TestFactory, LookupFactory,$filter){

        $scope.formats = ['yyyy-M-d', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.test = {matrix_id:0,obr_type_id:0,segment_num2:0,segment_num3:0,last_update_date : $filter('date')(new Date(),'yyyy-M-d')};
        $scope.loadingIsDone = false;

        $scope.today = function() {
            $scope.test.test_start_date = new Date();
        };

        $scope.clear = function () {
            $scope.test.test_start_date = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.matrixDD = [{id:0,name:'Select Matrix'}];
        $scope.selectedM = 0;

        $scope.obrDD = [{id:0,name:'Select OBR Type'}];
        $scope.selectedObr = 0;

        $scope.segTwoDD = [{id:0,name:'Select Segment2'}];
        $scope.selectedTwo = 0;

        $scope.segThreeDD = [{id:0,name:'Select Segment3'}];
        $scope.selectedThree = 0;

        $scope.fnFetchLookup = function(){
            $scope.lookupArr = LookupFactory.query(function(res){
                angular.forEach(res,function(val,intIndex){
                    $scope.matrixDD.push({id:val.MATRIX_ID,name:val.MATRIX_DESC});
                    $scope.obrDD.push({id:val.OBR_TYPE_ID,name:val.OBR_TYPE_DESC});
                    $scope.segTwoDD.push({id:val.SEGMENT_NUM2,name:val.SEGMENT_NUM2_DESC});
                    $scope.segThreeDD.push({id:val.SEGMENT_NUM3,name:val.SEGMENT_NUM3_DESC});
                });
            });
        };

        $scope.fnSaveTest = function(test){
            var test = angular.copy(test);
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.labTestForm.$valid) {
                if (test.test_id) {
                    test.creation_date = $filter('date')(test.creation_date, 'yyyy-M-d hh:mm:ss');
                    test.last_update_date = $filter('date')(test.last_update_date, 'yyyy-M-d hh:mm:ss');
                    TestFactory.update({testId: test.test_id}, test, function (res,status) {
                        $scope.findOne();
                        toastr.success('Record updated successfully.', 'Updated');
                    });
                } else {
                    test.matrix_id = test.matrix_id ? test.matrix_id : null;
                    test.obr_type_id = test.obr_type_id ? test.obr_type_id : null;
                    test.segment_num2 = test.segment_num2 ? test.segment_num2 : null;
                    test.segment_num3 = test.segment_num3 ? test.segment_num3 : null;
                    test.creation_date = $filter('date')(Date.now(), 'yyyy-M-d hh:mm:ss');
                    test.test_start_date = $filter('date')(test.test_start_date, 'yyyy-M-d hh:mm:ss');
                    TestFactory.create(test, function (res) {
                        toastr.success('Record created successfully.', 'Created');
                    });
                }
            }
        };

        $scope.fnReset = function() {
            $scope.$broadcast('show-errors-reset');
            $scope.test = {matrix_id:0,obr_type_id:0,segment_num2:0,segment_num3:0};
            $scope.test.test_start_date = new Date();
        };

        $scope.findOne = function() {
            if($routeParams.testId)
            {
                TestFactory.show({
                    testId: $routeParams.testId
                }, function(res) {
                     angular.forEach(res, function (val, key) {
                        if (typeof res === 'object'){
                            res[key.toLowerCase()] = res[key];
                            delete res[key];
                        }
                     });
                    res.last_update_date = $filter('date')(res.last_update_date,$scope.formats[0]);
                    $scope.test = res;
                    $scope.$watchGroup(['test.matrix_id', 'test.obr_type_id', 'test.segment_num2', 'test.segment_num3'], function (newValues, oldValues, scope) {
                        $scope.test.matrix_id = newValues[0];
                        $scope.test.obr_type_id = newValues[1];
                        $scope.test.segment_num2 = newValues[2];
                        $scope.test.segment_num3 = newValues[3];
                    });
                    $scope.loadingIsDone = true;
                });
            }
        };

        $scope.fnInitTest = function(){
            $scope.today();
            $scope.toggleMin();
            $scope.fnFetchLookup();
        };
    }]);