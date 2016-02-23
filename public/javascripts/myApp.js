/* global angular */

var myApp = angular.module('myApp', ['appRoutes', 'authService', 'mainCtrl', 
    'userService', 'userCtrl', 'adminService', 'adminCtrl', 'instructorCtrl', 
    'studentCtrl', 'reverse']);

myApp.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
});