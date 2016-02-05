/* global angular */

var routes = angular.module('appRoutes', ['ngRoute']);
        
routes.config(function($routeProvider, $locationProvider){
      
      $routeProvider
              .when('/', {
                  templateUrl: 'home.html',
                  controller: 'mainController'
              })
              .when('/login', {
                  templateUrl: 'login.html',
                  controller: 'mainController'
              })
              .when('/signup', {
                  templateUrl: 'admin/signup.html',
                  controller: 'createUserController'
              });
              
      $locationProvider.html5Mode(true);
});