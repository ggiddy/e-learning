/* global angular */

var studentCtrl = angular.module('studentCtrl', []);

studentCtrl.controller('studentController', function($scope, $window, Admin){
    $scope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };
    $scope.classes = [];
    
    /**
     * This function populates the page with a list of all classes that a lecturer takes upon page load.
     */
    angular.element(document).ready(function(){
        Admin.getClasses().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes.push(value);
            });
        });
    });
    
});