/* global angular */

var myApp = angular.module('myApp', ['appRoutes', 'authService', 'mainCtrl', 
    'userService', 'userCtrl', 'adminService', 'adminCtrl', 'instructorCtrl', 
     'instructorService', 'studentCtrl', 'studentService', 'reverse', 'luegg.directives',
     'ui.bootstrap', 'ui.tinymce', 'resoursesCtrl', 'resoursesService']);

myApp.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
});