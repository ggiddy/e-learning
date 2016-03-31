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
                   
                   var user_data = {
                       first_name: data.first_name, 
                       last_name: data.last_name,
                       user_type: data.user_type,
                       id: data.id
                   };
                   
                   authToken.setUserData(user_data);
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
                   
                   var user_data = {
                       first_name: data.first_name, 
                       last_name: data.last_name,
                       user_type: data.user_type,
                       id: data.id
                   };
                   
                   authToken.setUserData(user_data);
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
         
        var user_data = {
          first_name: data.first_name, 
          last_name: data.last_name,
          user_type: data.user_type,
          id: data.id
        };
         
        authToken.setUserData(user_data);
         
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
        return $http.post('/auth/expert/login', {username: email_address, password: password})
               .success(function(data){
                   authToken.setToken(data.token);
                   authToken.setUserData(data);
                   return data;
               });
   };
   
   /**
    * This method logs out a user.
    * @returns {unresolved}
    */
   authFactory.logout = function(){
       authToken.setToken();
       authToken.setUserData();
       return; 
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
        return $window.sessionStorage.getItem('token');
    };
    
    authTokenFactory.setToken = function(token){
        if(token){
            return $window.sessionStorage.setItem('token', token);
        }
        
        return $window.sessionStorage.removeItem('token');
    };
    
    authTokenFactory.setUserData = function(user_data){
        if(user_data){
            $window.sessionStorage.setItem('first_name', user_data.first_name);
            $window.sessionStorage.setItem('last_name', user_data.last_name);
            $window.sessionStorage.setItem('user_type', user_data.user_type);
            $window.sessionStorage.setItem('id', user_data.id);
            return;
        }
        
        $window.sessionStorage.removeItem('first_name');
        $window.sessionStorage.removeItem('last_name');
        $window.sessionStorage.removeItem('user_type');
        $window.sessionStorage.removeItem('id');
        return;
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