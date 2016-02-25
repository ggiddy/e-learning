/* global angular */

var instructorCtrl = angular.module('instructorCtrl', []);

instructorCtrl.controller('instructorController', function($scope, $window, Instr, Admin){
    $scope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };
    $scope.classes = [];
    $scope.selectedClasses = [];
    $scope.objClassIds = {classes_taught: {}};
    $scope.classes_taught = [];
    $scope.has_cls = true;
    
    
    /**
     *This method gets all the classes that an instructor is currently teaching 
     */
    angular.element(document).ready(function(){
        Instr.getClasses($scope.userData.id);
        Instr.getClasses($scope.userData.id).success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes_taught.push(value);
            });
        })
        .success(function(){
            Instr.clearTaught();
            $scope.has_classes();
        });
        Admin.getClasses().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes.push(value);
            });
        });
    });
    
    
    $scope.has_classes = function(){
        console.log($scope.classes_taught);
        return $scope.classes_taught.length > 0 ? $scope.has_cls = true : $scope.has_cls = false;
    };
    
    
    /**
     * This function gets all the classes in the database to enable an instructor to choose the ones they need.
     */
    
    
    /**
     * This method allows an instructor to choose the classes that he will teach.
     * 
     * @returns {undefined}
     */
    $scope.getInstructorSelections = function(){
        $scope.message = '';
        angular.forEach($scope.classes, function(clas, key){
            if(clas.selected){
                 $scope.selectedClasses.push(clas._id);
            }
        });
        
        $scope.objSelections = {
            selections: $scope.selectedClasses
        };
       
        Instr.insertSelections($scope.userData.id, $scope.objSelections).success(function(data){
            $scope.selectedClasses = [];
            $scope.message = data.message;
            alert($scope.message);
        });       
    };
   
});