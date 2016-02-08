var adminService = angular.module('adminService', []);

adminService.factory('Admin', function($http){
	var adminFactory = {};

	adminFactory.getClasses = function(){
		return $http.get('/admin/class');
	};
});