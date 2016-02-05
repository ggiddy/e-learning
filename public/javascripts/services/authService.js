/* global angular */

var authService = angular.module('authService', []);

authService.factory('Auth', function($q, $http, authToken){
   authFactory = {};
   
   /**
    * This method logs in an admin.
    * 
    * @param {string} email_address
    * @param {string} password
    * @returns {object} data
    */
   authFactory.loginAdmin = function(email_address, password){
        return $http.post('/auth/admin/login', {email_address: email_address, password: password})
               .success(function(data){
                   authToken.setToken(data.token);
                   return data;
               });
   };
   
   /**
    * This method logs in a student.
    * 
    * @param {string} admission_no
    * @param {string} password
    * @returns {object} data
    */
   authFactory.loginStudent = function(admission_no, password){
        return $http.post('/auth/student/login', {admission_no: admission_no, password: password})
               .success(function(data){
                   authToken.setToken(data.token);
                   return data;
               });
   };
   
   /**
    * This method logs in an instructor.
    * 
    * @param {string} email_address
    * @param {string} password
    * @returns {object} data
    */
   authFactory.loginInstructor = function(email_address, password){
        return $http.post('/auth/instructor/login', {email_address: email_address, password: password})
               .success(function(data){
                   authToken.setToken(data.token);
                   return data;
               });
   };
   
   /**
    * This method logs in an expert.
    * 
    * @param {string} email_address
    * @param {string} password
    * @returns {object} data
    */
   authFactory.loginExpert = function(email_address, password){
        return $http.post('/auth/instructor/login', {username: email_address, password: password})
               .success(function(data){
                   authToken.setToken(data.token);
                   return data;
               });
   };
   
   /**
    * This method logs out a user.
    * @returns {unresolved}
    */
   authFactory.logout = function(){
       return authToken.setToken();
   };
   
   authFactory.isLoggedIn = function(){
       if(authToken.getToken()){
           return true;
       } else {
           return false;
       }
   };
   
   authFactory.getUser = function(){
       if(authToken.getToken()){
           return $http.get('access/me');
       }
       
       return $q.reject({message: 'User has no token'});
   };
   
   return authFactory;
});

authService.factory('authToken', function($window){
    var authTokenFactory = {};
    
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    };
    
    authTokenFactory.setToken = function(token){
        if(token){
            return $window.localStorage.setItem('token', token);
        }
        
        return $window.localStorage.removeItem('token');
    };
    
    return authTokenFactory;
});

authService.factory('authInterceptor', function($q, $location, authToken){
    var interceptorFactory = {};
    
    interceptorFactory.request = function(config){
        var token = authToken.getToken();
        
        if(token){
            config.headers['x-access-token'] = token;
        }
        
        return config;
    };
    
    interceptorFactory.responseError = function(response){
        if(response.status === 403){
            $location.path('/');
        }
        
        return $q.reject(response);
    };
    
    return interceptorFactory;
});