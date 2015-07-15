'use strict';
app.controller('NavBarCtrl',
    function ($scope, $rootScope, $location) {

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }
);
