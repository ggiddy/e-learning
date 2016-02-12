/* global angular */

var adminCtrl = angular.module('adminCtrl', ['adminService']);

adminCtrl.controller('adminController', function($scope, Admin){
    
    /*Variables to be used to interaxt with the scope*/
    
    $scope.classes = [];
    $scope.admins = [];
    $scope.students = [];
    $scope.instructors = [];
    $scope.experts = [];
    $scope.error = '';
    $scope.classData = {class_name: '', class_code: '', class_venue: '', class_time: '', class_duration: ''};
    
    
    /**
     * This function getClasses populates the page with a list of all classes upon page load.
     */
    angular.element(document).ready(function(){
        Admin.getClasses().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes.push(value);
            });
        });
    });
    
    /**
     * This function utilizes the service method that creates a new class.
     * @returns {undefined}
     */
    $scope.newClass = function(){
        Admin.addClass($scope.classData).success(function(data){
            $scope.classData = {class_name: '', class_code: '', class_venue: '', class_time: '', class_duration: ''};
        });
    };
    
    /**
     * This method populates the admins array with the list of all administrators registered in the system on page load.
     */
    angular.element(document).ready(function(){
        Admin.getAdmins().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.admins.push(value);
            });
        });
    });
    
    /**
     * This method populates the instructors array with the list of all administrators registered in the system on page load.
     */
    angular.element(document).ready(function(){
        Admin.getInstructors().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.instructors.push(value);
            });
        });
    });
    
    /**
     * This method populates the experts array with the list of all administrators registered in the system on page load.
     */
    angular.element(document).ready(function(){
        Admin.getExperts().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.experts.push(value);
            });
        });
    });
    
    /**
     * This method populates the students array with the list of all administrators registered in the system on page load.
     */
    angular.element(document).ready(function(){
        Admin.getStudents().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.students.push(value);
            });
        });
    });
});