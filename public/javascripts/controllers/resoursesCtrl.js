/* global angular */

var resoursesCtrl = angular.module('resoursesCtrl', ['ngDropzone']);

resoursesCtrl.controller('resoursesController', function($scope, $window, $routeParams, Resourses, socketio){

	//object that holds a user's session data.
	$scope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };

	//scope array to store all resourses.
	$scope.class_resourses = [];

	$scope.dzAddedFile = function(file){
	
	};

	$scope.dzError = function(file, error_message){
		$log.log(error_message);
	};

	$scope.dropzoneConfig = {
		parallelUploads: 5,
		maxFileSize: 30,
		url: '/resourses'
	}; 

	/**
	 *This method attaches additional parameters to send alongside with the uploaded file.
	 *
	 *@param{file} file The uploaded file'
	 *@param{object} xhr The xhr object of the file.
	 *@param{object} formData Parameters associated with the file.
	 */
	$scope.dzSending = function(file, xhr, formData){
		formData.append('uploader', $scope.userData.first_name + ' ' + $scope.userData.last_name);
		formData.append('class_id', $routeParams.classId);
	}; 

	/**
	 *This method utilizes a service to get all class resourses uploaded on page load.
	 *
	 *@param{null}
	 *@return{void}
	 */
	 angular.element(document).ready(function(){
	 	$scope.class_resourses = [];
	 	Resourses.getAllResourses($routeParams.classId).success(function(data){
	 		angular.forEach(data, function(value, key){
	 			$scope.class_resourses.push(value);
	 		})	
	 	});
	 });

	 //listen to upload events
	 socketio.on('resourse' + $routeParams.classId, function(data){
	 	$scope.class_resourses.push(data);
	 });

	//variable that determines whether the sidebar is visible or not.
    $scope.isActive = false;

    //toggle the status of the isActive
    $scope.toggleCanvas = function(){
        $scope.isActive = !$scope.isActive;
    };

    //assign classes depending on whether the sidebar will be shown or not.
    $scope.canvasClass = function(){
        return $scope.isActive ? 'row row-offcanvas row-offcanvas-right active' : 'row row-offcanvas row-offcanvas-right';
    }
	  
});