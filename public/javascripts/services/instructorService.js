/* global io, angular */

var instructorService = angular.module('instructorService', []);

instructorService.factory('Instr', function($http){
    var instructorFactory = {};
          
    instructorFactory.insertSelections = function(id, objSelections){
        return $http.patch('/instructor/add_classes/' + id, objSelections);
    };

    instructorFactory.removeSelections = function(id, objRemove){
        return $http.patch('/instructor/remove_classes/' + id, objRemove);
    };

    instructorFactory.getClassIds = function(id){
        return $http.get('/instructor/get_classes/'+id);
    };
    instructorFactory.getClasses = function(id){
        return $http.get('instructor/get_classes/'+id);
    };
    instructorFactory.sendMsg = function(class_id, msgData){
       return $http.post('/instructor/messages/' + class_id, msgData); 
    };
    instructorFactory.getMsgs = function(class_id){
       return $http.get('/instructor/messages/' + class_id); 
    };
  
  return instructorFactory;
});

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
});