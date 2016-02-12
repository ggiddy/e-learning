/* global angular */

var routes = angular.module('appRoutes', ['ngRoute']);
        
routes.config(function($routeProvider, $locationProvider){
      
      $routeProvider
              .when('/', {
                  templateUrl: 'home.html',
                  controller: 'mainController'
              })
              //Routes that open personal account homepages of the different users
              .when('/admin', {
                  templateUrl: 'admin/admin_home.html',
                  controller: 'adminController'
              })
              .when('/student', {
                  templateUrl: 'student/home.html',
                  controller: 'mainController'
              })
              .when('/expert', {
                  templateUrl: 'expert/home.html',
                  controller: 'mainController'
              })
              .when('/instructor', {
                  templateUrl: 'instructor/home.html',
                  controller: 'mainController'
              })
              
              
              //Routes that administrator uses to view different groups of users
              .when('/admins', {
                  templateUrl: 'admin/administrators.html',
                  controller: 'adminController'
              }).when('/students', {
                  templateUrl: 'admin/students.html',
                  controller: 'adminController'
              }).when('/instructors', {
                  templateUrl: 'admin/instructors.html',
                  controller: 'adminController'
              }).when('/experts', {
                  templateUrl: 'admin/experts.html',
                  controller: 'adminController'
              });
              
      //$locationProvider.html5Mode(true);
});