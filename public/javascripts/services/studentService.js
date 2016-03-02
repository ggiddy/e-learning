/* global io, angular */

var studentService = angular.module('studentService', []);

studentService.factory('Student', function($http){
	var studentFactory = {};
        
        studentFactory.insertSelections = function(id, objSelections){
            return $http.patch('/student/add_classes/' + id, objSelections);
        };
        studentFactory.getClassIds = function(id){
            return $http.get('/student/get_classes/'+id);
        };
        studentFactory.getClasses = function(id){
            return $http.get('student/get_classes/'+id);
        };
        return studentFactory;
});

studentService.factory('socketio', function($rootScope){
    var socket = io.connect();
    
    return{
       on: function(eventName, callback){
           socket.on(eventName, function(){
               var args = arguments;
               
               $rootScope.$apply(function(){
                   callback.apply(socket, args);
               });
           });
       }, 
       emit: function(eventName, data, callback){
           socket.emit(eventName, data, function(){
               var args = arguments;
               $rootScope.$apply(function(){
                   if(callback){
                       callback.apply(socket, args);
                   }
               });
           });
       }
    };
}); 