/* global io, angular */

var studentService = angular.module('studentService', []);

studentService.factory('Student', function($http){
	var studentFactory = {};
        
        studentFactory.insertSelections = function(id, objSelections){
            return $http.patch('/student/add_classes/' + id, objSelections);
        };

        studentFactory.removeSelections = function(id, objRemove){
            return $http.patch('/student/remove_classes/' + id, objRemove);
        };

        studentFactory.getClassIds = function(id){
            return $http.get('/student/get_classes/'+id);
        };

        studentFactory.getClasses = function(id){
            return $http.get('student/get_classes/'+id);
        };

        return studentFactory;
});