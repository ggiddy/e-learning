/* global angular */

/**
 * This module is responsible for signing up users into the system.
 * 
 * @type @exp;angular@call;module
 */
var userService = angular.module('userService', []);

userService.factory('User', function($http){
    var userFactory = {};
    
    /**
     * This function creates a student account.
     * 
     * @param {object} userData
     * @returns {object}
     */
    userFactory.createStudent = function(userData){
        return $http.post('/auth/student/signup', userData);
    };
    
    /**
     * This function creates a admin account.
     * 
     * @param {object} userData
     * @returns {object}
     */
    userFactory.createAdmin = function(userData){
        return $http.post('/auth/admin/signup', userData);
    };
    
    /**
     * This function creates a instructor account.
     * 
     * @param {object} userData
     * @returns {object}
     */
    userFactory.createInstructor = function(userData){
        return $http.post('/auth/instructor/signup', userData);
    };
    
    /**
     * This function creates a expert account.
     * 
     * @param {object} userData
     * @returns {object}
     */
    userFactory.createExpert = function(userData){
        return $http.post('/auth/expert/signup', userData);
    };
    
    return userFactory;
});