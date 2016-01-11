/**
 * Created by dougritzinger on 10/20/15.
 */
var app = angular.module('myApp', ['ngRoute', 'ngFileUpload']);

app.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
        })
        .when('/calendar', {
            templateUrl: 'views/calendar.html',
            controller: 'CalendarController'
        })
        .when('/rivers', {
            templateUrl: 'views/rivers.html',
            controller: 'RiversController'
        })
        .when('/bulletin', {
            templateUrl: 'views/bulletin.html',
            controller: 'BulletinController'
        })
        .when('/mytrips', {
            templateUrl: 'views/mytrips.html',
            controller: 'MyTripsController'
        })
        .when('/tripleader', {
            templateUrl: 'views/tripleader.html',
            controller: 'TripLeaderController'
        })
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdminController'
        })
        .when('/loginorregister', {
            templateUrl: 'views/loginorregister.html',
            controller: 'LoginOrRegisterController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LogInController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);

});


    ////////////////////////////////////////////////////////
    // control the visibility of the index page Nav items //
    ////////////////////////////////////////////////////////

app.controller('IndexNav', ['$scope', '$rootScope', function($scope, $rootScope){

    console.log('IndexNav controller running');

}]);


