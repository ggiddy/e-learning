/* global angular */

var mainCtrl = angular.module('mainCtrl', ['authService']);

mainCtrl.controller('mainController', function($scope, $rootScope, $location, Auth){
    $rootScope.user = {email_address: '', id: ''};
    $rootScope.loggedIn = Auth.isLoggedIn();

    //array to hold the alerts to be displayed on the admin page
    $scope.alerts = [];
    
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
        Auth.loginAdmin($scope.email_address, $scope.password).success(function(data){
            if(!data.success){
                alert(data.message);
            }

            //if the login request was successful
            Auth.getUser().success(function(data){
                $rootScope.user.email_address = data.email_address;
                $rootScope.user.id = data.id;
                $rootScope.user.admin = true;

                $location.path('/admin');
            });
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
            if(!data.success){
                alert(data.message);
            }

            //if the login request was successful
            Auth.getUser().success(function(data){
                $rootScope.user.email_address = data.email_address;
                $rootScope.user.id = data.id;

                return $location.path('/student');
            });
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
            if(!data.success){
                alert(data.message);
            }

            //if the login request was successful
            Auth.getUser().success(function(data){
                $rootScope.user.email_address = data.email_address;
                $rootScope.user.id = data.id;

                return $location.path('/instructor');
            });
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

    /**
     *This function is used to push alerts onto the alerts array.
     */
    $scope.addAlert = function(type, message) {

        //add the new alert into the array of alerts to be displayed.
        $scope.alerts.push({type: type, msg: message});
    };

    /**
     *This function closes the alert
     */
    $scope.closeAlert = function(index) {
        
        //remove the alert from the array to avoid showing previous alerts
        $scope.alerts.splice(0); 
    };
    
});