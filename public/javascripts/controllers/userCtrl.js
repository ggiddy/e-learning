/* global angular */

var userCtrl = angular.module('userCtrl', ['userService']);

userCtrl.controller('createAdminController', function($scope, $location, $window, User){
    
    $scope.userData = {first_name: '', last_name: '', email_address: '', password: '', user_type: 'admin'};
    $scope.message = '';
 
    $scope.signUpAdmin = function(){
        User.createAdmin($scope.userData).success(function(data){
            $scope.userData = {first_name: '', last_name: '', email_address: '', password: '', user_type: 'admin'};
            $scope.message = data.message;
            $window.sessionStorage.setItem('token', data.token);
            
            return $location.path('/admin');
        });
    };
});

userCtrl.controller('createStudentController', function($scope, $location, $window, User){
    
    $scope.userData = {first_name: '', last_name: '', email_address: '', password: '', admission_no: '', faculty: '', user_type: 'student'};
    $scope.message = '';
    
    $scope.signUpStudent = function(){
        User.createStudent($scope.userData).success(function(data){
            $scope.userData = {first_name: '', last_name: '', email_address: '', password: '', admission_no: '', faculty: '', user_type: 'student'};
            $scope.message = data.message;
            $window.sessionStorage.setItem('token', data.token);
            
            return $location.path('/student');
        });
    };
});

userCtrl.controller('createInstructorController', function($scope, $location, User){
    
    $scope.userData = {first_name: '', last_name: '', email_address: '', password: '', faculty: '', user_type: 'instructor'};
    $scope.message = '';
    
    $scope.signUpInstructor = function(){
        User.createInstructor($scope.userData).success(function(data){
            $scope.userData = {first_name: '', last_name: '', email_address: '', password: '', faculty: '', user_type: 'instructor'};
            $scope.message = data.message;
            
            return $location.path('/instructors');
        });
    };
});


userCtrl.controller('createExpertController', function($scope, $location, User){
    
    $scope.userData = {first_name: '', last_name: '', email_address: '', password: '', specialty: '', user_type: 'expert'};
    $scope.message = '';
    
    $scope.signUpExpert = function(){
        User.createExpert($scope.userData).success(function(data){
            $scope.userData = {first_name: '', last_name: '', email_address: '', password: '', specialty: '', user_type: 'instructor'};
            $scope.message = data.message;
            
            return $location.path('/experts');
        });
    };
});