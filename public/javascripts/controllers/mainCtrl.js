/* global angular */

var mainCtrl = angular.module('mainCtrl', ['authService']);

mainCtrl.controller('mainController', function($scope, $rootScope, $location, Auth){
    $rootScope.user = {email_address: '', id: ''};
    $rootScope.loggedIn = Auth.isLoggedIn();
    
    $rootScope.$on('$routeChangeStart', function(){
        $rootScope.loggedIn = Auth.isLoggedIn();
        
        if($rootScope.loggedIn){
            Auth.getUser().success(function(data){
                $rootScope.user.email_address = data.email_address;
                $rootScope.user.id = data.id;
            }); 
        } else {
            $location.path('/');
        }
        
    });
    
    /**
     * This method logs in an admin.
     * 
     * @returns {route} Redirects to admin's account
     */
    $scope.adminLogin = function(){
        $scope.error = '';
        Auth.loginAdmin($scope.email_address, $scope.password).success(function(data){
            Auth.getUser().success(function(data){
                $rootScope.user.email_address = data.email_address;
                $rootScope.user.id = data.id;
                $rootScope.user.admin = true;
            });
            if(data.success){
                return $location.path('/admin');
            } else {
                return $scope.error = data.message;
            }
        });
    };
    
    /**
     * This method logs in an student.
     * 
     * @returns {route} Redirects to student's account
     */
    $scope.studentLogin = function(){
        $scope.error = '';
        Auth.loginStudent($scope.admission_no, $scope.password).success(function(data){
            Auth.getUser().success(function(data){
                $rootScope.user.email_address = data.email_address;
                $rootScope.user.id = data.id;
            });
            if(data.success){
                return $location.path('/student');
            } else {
                return $scope.error = data.message;
            }
        });
    };
    
    /**
     * This method logs in an instructor.
     * 
     * @returns {route} Redirects to instructor's account
     */
    $scope.instructorLogin = function(){
        $scope.error = '';
        Auth.loginInstructor($scope.email_address, $scope.password).success(function(data){
            Auth.getUser().success(function(data){
                $rootScope.user.email_address = data.email_address;
                $rootScope.user.id = data.id;
            });
            if(data.success){
                return $location.path('/instructor');
            } else {
                return $scope.error = data.message;
            }
        });
    };
    
    /**
     * This method logs in an expert.
     * 
     * @returns {route} Redirects to expert's account
     */
    $scope.expertLogin = function(){
        $scope.error = '';
        Auth.loginExpert($scope.email_address, $scope.password).success(function(data){
            Auth.getUser().success(function(data){
                $rootScope.user.email_address = data.email_address;
                $rootScope.user.id = data.id;
            });
            if(data.success){
                return $location.path('/expert');
            } else {
                return $scope.error = data.message;
            }
        });
    };    
    
    $rootScope.logout = function(){
        Auth.logout();
        return $location.path('/');
    };
    
});