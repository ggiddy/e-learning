/* global io, angular */

var instructorService = angular.module('instructorService', []);

instructorService.factory('Instr', function($http){
	var instructorFactory = {};
        
        instructorFactory.insertSelections = function(id, objSelections){
            return $http.patch('/instructor/add_classes/' + id, objSelections);
        };
        
        instructorFactory.getClassIds = function(id){
            return $http.get('/instructor/get_classes/'+id);
        };
        instructorFactory.getClasses = function(id){
            return $http.get('instructor/get_classes/'+id);
        };
        instructorFactory.clearTaught = function(){
            return $http.get('/instructor/clear_taught');
        };
        
        return instructorFactory;
});
/**
instructorService.factory('socketio', function($rootScope){
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
}); **/