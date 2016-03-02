/* global angular */

var studentCtrl = angular.module('studentCtrl', []);

studentCtrl.controller('studentController', function($scope, $window, Student, Admin){
    $scope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };
    $scope.classes = [];
    $scope.selectedClasses = [];
    $scope.objClassIds = {classes_taught: {}};
    $scope.classes_taken = [];
    $scope.has_cls = true;
    
    
    /**
     *This method gets all the classes that an student is currently taking 
     */
    angular.element(document).ready(function(){
        Student.getClasses($scope.userData.id);
        Student.getClasses($scope.userData.id).success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes_taken.push(value);
            });
        })
        .success(function(){
            $scope.has_classes();
        })
        .success(function(){
            Student.clearTaken();
        });
        Admin.getClasses().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes.push(value);
            });
        });
    });
    
    /**
     * This method checks whether the student is taking any classes.
     * 
     * @returns {Boolean} true if they are taking classes false if not.
     */
    $scope.has_classes = function(){
        return $scope.classes_taken.length > 0 ? $scope.has_cls = true : $scope.has_cls = false;
    };
    
    /**
     * This method allows a student to choose the classes that he will be taking.
     * 
     * @returns {undefined}
     */
    $scope.getStudentSelections = function(){
        $scope.message = '';
        angular.forEach($scope.classes, function(clas, key){
            if(clas.selected){
                 $scope.selectedClasses.push(clas._id);
            }
        });
        
        $scope.objSelections = {
            selections: $scope.selectedClasses
        };
       
        Student.insertSelections($scope.userData.id, $scope.objSelections).success(function(data){
            $scope.selectedClasses = [];
            $scope.message = data.message;
            alert($scope.message);
        });       
    };
   
});