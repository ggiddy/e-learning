/* global angular */

var resoursesCtrl = angular.module('resoursesCtrl', ['ngDropzone']);

resoursesCtrl.controller('resoursesController', function($scope){
	$scope.dzAddedFile = function(file){
		console.log("Yeey!! Upload success");
	};

	$scope.dzError = function(file, error_message){
		$log.log(error_message);
	};

	$scope.dropzoneConfig = {
		parallelUploads: 5,
		maxFileSize: 30,
		url: '/resourses'
	}    
});