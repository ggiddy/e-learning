var adminService = angular.module('adminService', []);

adminService.factory('Admin', function($http){
	var adminFactory = {};

	adminFactory.getClasses = function(){
		return $http.get('/admin/class');
	};
        
        adminFactory.addClass = function(classData){
            return $http.post('/admin/class', classData);
        };
        
        adminFactory.getAdmins = function(){
            return $http.get('/admin/admins');
        };
        
        adminFactory.getInstructors = function(){
            return $http.get('/admin/instructors');
        };
        
        adminFactory.getStudents = function(){
            return $http.get('/admin/students');
        };
        
        adminFactory.getExperts = function(){
            return $http.get('/admin/experts');
        };
        
        return adminFactory;
});