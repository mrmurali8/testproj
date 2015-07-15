var app = angular.module('NodeCRUD',['ngRoute', 'ngResource','ngGrid','ui.bootstrap']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/list.html',
            controller: 'listCtrl'
        })
        .when('/test', {
            templateUrl: '/views/test.html',
            controller: 'testCtrl'
        })
        .when('/test/:testId', {
            templateUrl: '/views/test.html',
            controller: 'testCtrl'
        });
});

app.constant("API_URL","/");