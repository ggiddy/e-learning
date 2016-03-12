/* global angular */

var resoursesService = angular.module('resoursesService', []);

resoursesService.factory('Resourses', function($http){
	var resourseFactory = {};

	resourseFactory.getAllResourses = function(class_id){
		return $http.get('/resourses/' + class_id);
	};

	return resourseFactory;
});