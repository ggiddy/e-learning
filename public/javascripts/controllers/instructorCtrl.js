/* global angular */

var instructorCtrl = angular.module('instructorCtrl', []);

instructorCtrl.controller('instructorController', function($scope, $rootScope, $location, $window, Instr, Admin){
    $rootScope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };
    $scope.classes = [];
    $scope.selectedClasses = [];
    $scope.objClassIds = {classes_taught: {}};
    $rootScope.classes_taught = [];
    $scope.has_cls = true;
    
    
    /**
     *This method gets all the classes that an instructor is currently teaching on page load
     *
     *@param{string} id The id of the specific instructor.
     *@return{object} data The classes taught by the instructor.
     */
    angular.element(document).ready(function(){

        //call service to get classes
        Instr.getClasses($scope.userData.id).success(function(data){

            //loop through the returned array adding each value to the scope's classes_taught array.
            angular.forEach(data, function(value, key){
                $rootScope.classes_taught.push(value);
            });
        })

        //when done check if anything was added to the scope's classes_taught array 
        .success(function(){
            $scope.has_classes();
        });

        /**
         *This method is used to get all the classes in the database, to be used by the instructor to choose the ones they will teach.
         *
         *@param{null}
         *@return{object} data The classes in the database.
         */
        Admin.getClasses().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes.push(value);
            });
        });
    });
    
    /**
     *This method is clears the scope's classes_taught array to prevent appending of already available classes
     *
     *@param{null}
     *@return{void}
     */
    $scope.clearTaught = function(){
        $rootScope.classes_taught = [];
    };
    
    /**
     *This method checks whether the rootScope's classes taught array has any items(classes)
     *
     *@param{null}
     *@return{bool} true if the array has items false if the array has no items
     */
    $scope.has_classes = function(){
        return $rootScope.classes_taught.length > 0 ? $scope.has_cls = true : $scope.has_cls = false;
    };
    
    /**
     * This method allows an instructor to choose the classes that he will teach.
     * 
     * @returns {undefined}
     */
    $scope.getInstructorSelections = function(){

        //the variable that  will hold any messages from the server
        $scope.message = '';

        //loop through the classes array checking if any if its items was selected.
        angular.forEach($scope.classes, function(clas, key){

            //add the ids of all selected items to the scope's selectedClasses array.
            if(clas.selected){
                 $scope.selectedClasses.push(clas._id);
            }
        });
        
        //create an object to hold the array of ids of selectedClasses
        $scope.objSelections = {
            selections: $scope.selectedClasses
        };
       
       /**
        *This method inserts the classes selected by the instructor to the database.
        *
        *@param{string} $scope.userData.id The id of the instructor performing the insertion.
        *@param{object} $scope.objSelections The classes that the instructor chooses to teach.
        *@return{object} data The message and the status of execution from the server.
        */
        Instr.insertSelections($scope.userData.id, $scope.objSelections).success(function(data){
            $scope.selectedClasses = [];
            $scope.message = data.message;
            alert($scope.message);
        });       
    };
});

instructorCtrl.controller('instrClassController', function($scope, $rootScope, $window, $routeParams, Instr, socketio){
    $rootScope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };
    $scope.msgData = {
        sender: $scope.userData.first_name + ' ' + $scope.userData.last_name,
        class_id: '',
        message: ''
    };
    $scope.messages = [];
    
    angular.element(document).ready(function(){
        Instr.getMsgs($routeParams.classId).success(function(data){
            angular.forEach(data, function(value, key){
                $scope.messages.push(value);
            });
        });
    
        socketio.on($routeParams.classId, function(data){
            $scope.messages.push(data);
            $scope.msgData.message = '';
        });
    });
    
    /**
     * This method sends a message to the class
     */
    $scope.sendMessage = function(){
        $scope.message = '';
  
        Instr.sendMsg($routeParams.classId, $scope.msgData).then(function(){
            $scope.msgData.message = '';
        });
    };
});