/* global io, angular */

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
    
    adminFactory.changeAdminPassword = function(adminData){
        return $http.patch('/admin/change_admin_pwd', adminData);
    };
    
    adminFactory.resetAdminPassword = function(id){
        return $http.patch('/admin/reset_admin_pwd/' + id);
    };
    
    adminFactory.resetInstructorPassword = function(id){
        return $http.patch('/admin/reset_instructor_pwd/' + id);
    };
    
    adminFactory.resetStudentPassword = function(id){
        return $http.patch('/admin/reset_student_pwd/' + id);
    };
    
    adminFactory.resetExpertPassword = function(id){
        return $http.patch('/admin/reset_expert_pwd/' + id);
    };
    
    adminFactory.archiveAdminAccount = function(id, data){
        return $http.patch('/admin/archive_admin/' + id, data);
    };
    
    return adminFactory;
});