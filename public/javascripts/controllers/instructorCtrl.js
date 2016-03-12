/* global angular */

var instructorCtrl = angular.module('instructorCtrl', ['ngSanitize']);

instructorCtrl.controller('instructorController', function($scope, $rootScope, $location, $window, Instr, Admin, socketio){
    
    //object which holds the client's session details
    $scope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };

    //array that holds all the classes in the database
    $scope.classes = [];

    //array that holds the classes that the instructor selects to teach
    $scope.selectedClasses = [];

    //array that holds the classes that the instructor chooses to remove
    $scope.selectedRemove = [];

    //object that holds the classes taught that will be sent to the server
    $scope.objClassIds = {classes_taught: {}};

    //array that holds the classes taught by an instructor
    $rootScope.classes_taught = [];

    //flag that shows whether the instructor has classes
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
                $scope.classes_taught.push(value);
            });
        })

        //when done check if anything was added to the scope's classes_taught array 
        .success(function(){
            $scope.has_classes();
        });

        //listen to events where the instructor adds a new class
        socketio.on($scope.userData.id, function(data){
            angular.forEach(data, function(value, key){
                $rootScope.classes_taught.push(value);
                $scope.has_classes();
            });
        });  

        //listen to events where the instructor removes a class
        socketio.on($scope.userData.id + 'remove', function(data){
            $rootScope.classes_taught = [];
            angular.forEach(data, function(value, key){
                $rootScope.classes_taught.push(value);
            });
        
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
        $scope.classes_taught = [];
    };
    
    /**
     *This method checks whether the scope's classes taught array has any items(classes)
     *
     *@param{null}
     *@return{bool} true if the array has items false if the array has no items
     */
    $scope.has_classes = function(){
        return $scope.classes_taught.length > 0 ? $scope.has_cls = true : $scope.has_cls = false;
    };
    
    /**
     * This method allows an instructor to choose the classes that he will teach.
     * 
     * @returns {undefined}
     */
    $scope.selectInstructorClasses = function(){

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
        
        //call a service to insert the classes selected into the database
        Instr.insertSelections($scope.userData.id, $scope.objSelections).success(function(data){
            $scope.selectedClasses = [];
            $scope.message = data.message;
        });
    };

     /**
     * This method allows an instructor to remove the classes he chose to teach.
     * 
     * @returns {undefined}
     */
    $scope.removeClasses = function(){

        //the variable that  will hold any messages from the server
        $scope.message = '';

        //loop through the classes_taught array checking if any if its items was selected.
        angular.forEach($scope.classes_taught, function(clas, key){

            //add the ids of all selected items to the scope's selectedClasses array.
            if(clas.selected){
                 $scope.selectedRemove.push(clas._id);
            }
        });
        
        //create an object to hold the array of ids of selected
        $scope.objRemove = {
            selections: $scope.selectedRemove
        };
        
        //call a service to remove the classes selected from the database
        Instr.removeSelections($scope.userData.id, $scope.objRemove).success(function(data){
            $scope.selectedRemove = [];
            $scope.message = data.message;
        });       
    };

    /**
     *This method resizes the panels according to the number of classes taken by an instructor.
     *
     */
    $scope.resizePanel = function(){
        return ($scope.classes_taught.length > 3) ? "col-md-4 panel panel-success" : "panel panel-success";
    };

});

instructorCtrl.controller('instrClassController', function($scope, $scope, $window, $routeParams, $sce, Instr, socketio){
    
    //object that contains the tinyMce configuration options
    $scope.tinymceOptions = {};

    //variable to hold the class id to be used in the resourses page
    $scope.class_id = $routeParams.classId;

    //object that contains data session specific to the logged in user.
    $scope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };

    //object that is sent whenever an instructor sends a message.
    $scope.msgData = {
        sender: $scope.userData.first_name + ' ' + $scope.userData.last_name,
        class_id: '',
        message: ''
    };

    //array that holds all the messages from the server
    $scope.messages = [];
    
    /**
     *This method gets all messages sent to a class upon page load.
     *
     *@param{object} $classId The id of the class where the user wants to view.
     *@return{object} data An object containing all messages and their details.
     */
    angular.element(document).ready(function(){

        //call a service to get all messages
        Instr.getMsgs($routeParams.classId).success(function(data){

            //loop through the returned object and insert each iten to the messages array.
            angular.forEach(data, function(value, key){
                $scope.messages.push(value);
            });
        });
    
        //listen to events with the name of the current class.
        socketio.on($routeParams.classId, function(data){
            
            //with each event push its data to the messages array.
            $scope.messages.push(data);
            $scope.msgData.message = '';
            return;
        });
    });
    
    /**
     * This method sends a message to the class
     */
    $scope.sendMessage = function(){
        $scope.message = '';
        
        //call a service to send messages
        Instr.sendMsg($routeParams.classId, $scope.msgData).success(function(){
            $scope.msgData.message = '';
        });
    };
});