'use strict';
app.controller('listCtrl',
    function ($scope, $rootScope,$modal,$filter,TestFactory,LookupFactory) {

        $scope.isPogress = false;
        $scope.paramObj = {};
        $scope.matrixDD = [];
        $scope.selectedM = undefined;

        $scope.obrDD = [];
        $scope.selectedObr = undefined;

        $scope.segTwoDD = [];
        $scope.selectedTwo = undefined;

        $scope.segThreeDD = [];
        $scope.selectedThree = undefined;

        $scope.fnInitTest = function(){
            $scope.fnFetchLookup();
            $scope.getPagedDataAsync($scope.paramObj, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };

        $scope.fnFetchLookup = function(){
            $scope.lookupArr = LookupFactory.query(function(res){
                angular.forEach(res,function(val,intIndex){
                    $scope.matrixDD.push({id:val.MATRIX_ID,label:val.MATRIX_DESC});
                    $scope.obrDD.push({id:val.OBR_TYPE_ID,label:val.OBR_TYPE_DESC});
                    $scope.segTwoDD.push({id:val.SEGMENT_NUM2,label:val.SEGMENT_NUM2_DESC});
                    $scope.segThreeDD.push({id:val.SEGMENT_NUM3,label:val.SEGMENT_NUM3_DESC});
                });
            });
        };

        $scope.onMatrixSelect = function ($item, $model, $label) {
            $scope.paramObj.matrix_id = $item.id;
            $scope.getPagedDataAsync($scope.paramObj, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };

        $scope.onObrTypeSelect = function ($item, $model, $label) {
            $scope.paramObj.obr_type_id = $item.id;
            $scope.getPagedDataAsync($scope.paramObj, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };

        $scope.onSegment2Select = function ($item, $model, $label) {
            $scope.paramObj.segment_num2 = $item.id;
            $scope.getPagedDataAsync($scope.paramObj, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };

        $scope.onSegment3Select = function ($item, $model, $label) {
            $scope.paramObj.segment_num3 = $item.id;
            $scope.getPagedDataAsync($scope.paramObj, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };

        $scope.fnResetData = function () {
            $scope.selectedM = undefined;
            $scope.selectedObr = undefined;
            $scope.selectedTwo = undefined;
            $scope.selectedThree = undefined;
            $scope.paramObj = {};
            $scope.getPagedDataAsync($scope.paramObj, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };

        $scope.fnDeletedTestData = function () {
            $scope.paramObj.testStatus = "INACTIVE";
            $scope.getPagedDataAsync($scope.paramObj, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        };

        $scope.testLabFilterOptions = {
            filterText: "",
            useExternalFilter: false
        };

        $scope.testLabTotalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [5, 10, 25, 50],
            pageSize: 5,
            currentPage: 1
        };

        $scope.setPagingData = function (data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.testLabsData = pagedData;
            $scope.testLabTotalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync = function (obj, pageSize, page, filterText) {
            $scope.isPogress = true;
            if(isEmpty(obj)){
                TestFactory.fetch(function(res){
                    $scope.isPogress = false;
                    $scope.setPagingData(res, page, pageSize);
                });
            }else{
                TestFactory.fetch(obj,function(res){
                    $scope.isPogress = false;
                    $scope.setPagingData(res, page, pageSize);
                });
            }
        };

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                //was there a page change? if not make sure to reset the page to 1 because it must have been a size change
                if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
                    $scope.pagingOptions.currentPage = 1; //  this will also trigger this same watch
                } else {
                    // update the grid with new data
                    $scope.getPagedDataAsync($scope.paramObj,$scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.testLabFilterOptions.filterText);
                }
            }
        }, true);

        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.paramObj,$scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.testLabFilterOptions.filterText);
            }
        }, true);

        $scope.roAction = '<div class="container grid-action"><a class="btn btn-warning btn-xs" href="javascript:void(0)" ng-href="#/test/{{row.entity.TEST_ID}}"><span class="glyphicon glyphicon-edit"></span></a>'+
        ' <a class="btn btn-warning btn-xs" href="javascript:void(0)" ng-click="fnDelete(row.entity)"><span class="glyphicon glyphicon-trash text-danger"></span></a></div>';
        $scope.testLabGridOptions = {
            data: 'testLabsData',
            headerRowHeight:50,
            rowHeight: 50,
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'testLabTotalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.testLabFilterOptions,
            showFilter: true,
            multiSelect: false,
            showColumnMenu:true,
            columnDefs: [
                {field: 'LAB_TEST_STATUS', displayName: 'Lab Status', minWidth:200},
                {field: 'TEST_START_DATE', displayName: 'Test Start', cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 170, width: 'auto'},
                {field: 'CREATED_BY', displayName: 'Created By', cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 170, width: 'auto'},
                {field: 'CREATION_DATE', displayName: 'Creation', cellFilter: 'date:\'MM/dd/yyyy h:mm a\'',minWidth: 170, width: 'auto'},
                {field: 'LAST_UPDATED_BY', displayName: 'Last Updated By', minWidth: 200, width: 'auto'},
                {field: 'LAST_UPDATE_DATE', displayName: 'Last Updated', cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', minWidth: 170, width: 'auto'},
                {field: 'STATUS', displayName: 'Status', minWidth: 100, width: 'auto'},
                {field: 'MATRIX_DESC', displayName: 'Matrix', visible:false, minWidth: 100, width: 'auto'},
                {field: 'OBR_TYPE_DESC', displayName: 'OBR Type', visible:false, minWidth: 80, width: 'auto'},
                {field: 'SEGMENT_NUM2_DESC', displayName: 'Segment2', visible:false, minWidth: 100, width: 'auto'},
                {field: 'SEGMENT_NUM3_DESC', displayName: 'Segment3', visible:false, minWidth: 100, width: 'auto'},
                {displayName: 'Edit / Del',cellTemplate: $scope.roAction, width:80}
            ],
            plugins: [new ngGridFlexibleHeightPlugin()]
        };

        $scope.fnDelete = function(test) {
            $scope.animationsEnabled = true;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modal/deleteModal.html',
                controller: DeleteModalCtrl,
                size: 'sm'
            });

            function DeleteModalCtrl($scope,$modalInstance){
                $scope.fnSave = function () {$modalInstance.close(true);};
                $scope.fnCancel = function () {$modalInstance.dismiss('cancel');};
            }

            modalInstance.result.then(function (isDelete) {
                if(isDelete){
                    angular.forEach(test, function (val, key) {
                        if (typeof test === 'object'){
                            test[key.toLowerCase()] = test[key];
                            delete test[key];
                        }
                    });
                    test.creation_date = $filter('date')(test.creation_date, 'yyyy-M-d hh:mm:ss');
                    test.last_update_date = $filter('date')(test.last_update_date, 'yyyy-M-d hh:mm:ss');
                    test.test_start_date = $filter('date')(test.test_start_date, 'yyyy-M-d hh:mm:ss');
                    test.status = 'INACTIVE';
                    TestFactory.update({testId: test.test_id}, test,function(res){
                        $scope.getPagedDataAsync($scope.paramObj,$scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                    });
                }
            }, function () {});
    };
        /*---------------------- End Repair Orders -----------------------------*/

        function isEmpty(obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        }
    });
