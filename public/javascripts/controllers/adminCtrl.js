/* global angular */

var adminCtrl = angular.module('adminCtrl', ['adminService']);

adminCtrl.controller('adminController', function($scope, $window, $location, Auth, Admin, socketio){
    
    /*Variables to be used to interact with the scope*/
    
    $scope.classes = [];
    $scope.admins = [];
    $scope.students = [];
    $scope.instructors = [];
    $scope.experts = [];
    $scope.error = '';
    $scope.classData = {class_name: '', class_code: '', class_venue: '', class_time: '', class_duration: ''};
    $scope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };
    $scope.adminData = {admin_id: '', old_password: '', new_password: ''};
    
    
    /**
     * This function getClasses populates the page with a list of all classes upon page load.
     */
    angular.element(document).ready(function(){
        Admin.getClasses().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes.push(value);
            });
        });
    });
    
    /**
     * This function utilizes the service method that creates a new class.
     * @returns {undefined}
     */
    $scope.newClass = function(){
        Admin.addClass($scope.classData).success(function(data){
            $scope.classData = {class_name: '', class_code: '', class_venue: '', class_time: '', class_duration: ''};
        });
    };
    
    /**
     * This method populates the admins array with the list of all administrators registered in the system on page load.
     */
    socketio.on('newadmin', function(data){
        $scope.admins.push(data);
    });
    angular.element(document).ready(function(){
        Admin.getAdmins().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.admins.push(value);
            });
        });
    });
    
    /**
     * This method populates the instructors array with the list of all administrators registered in the system on page load.
     */
    angular.element(document).ready(function(){
        Admin.getInstructors().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.instructors.push(value);
            });
        });
    });
    
    /**
     * This method populates the experts array with the list of all administrators registered in the system on page load.
     */
    angular.element(document).ready(function(){
        Admin.getExperts().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.experts.push(value);
            });
        });
    });
    
    /**
     * This method populates the students array with the list of all administrators registered in the system on page load.
     */
    angular.element(document).ready(function(){
        Admin.getStudents().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.students.push(value);
            });
        });
    });
    
    /**
     * This method changes the password of an administrator.
     */
    $scope.changePassword = function(){
        $scope.message = '';
        $scope.adminData.admin_id = $scope.userData.id;
     
        Admin.changeAdminPassword($scope.adminData).success(function(data){
            $scope.adminData = {admin_id: '', old_password: '', new_password: ''};
            $scope.message = data.message;
            Auth.logout();
            $location.path('/');
        });
    };
    
    /**
     * This method resets an administrator's password
     */
    $scope.resetAdminPwd = function(reset_id){
        $scope.message = '';
        
        Admin.resetAdminPassword(reset_id).success(function(data){
            $scope.message = data.message;
            
            //show an alert that the password has sucessfully changed or otherwise
            alert($scope.message);
            return;
        });  
    };
    
    /**
     * This method resets an instructor's password
     */
    $scope.resetInstructorPwd = function(reset_id){
        $scope.message = '';
        
        Admin.resetInstructorPassword(reset_id).success(function(data){
            $scope.message = data.message;
            
            //show an alert that the password has sucessfully changed or otherwise
            console.log($scope.message);
            return;
        });  
    };
    
    /**
     * This method resets an student's password
     */
    $scope.resetStudentPwd = function(reset_id){
        $scope.message = '';
        
        Admin.resetStudentPassword(reset_id).success(function(data){
            $scope.message = data.message;
            
            //show an alert that the password has sucessfully changed or otherwise
            console.log($scope.message);
            return;
        });  
    };
    
    /**
     * This method resets an expert's password
     */
    $scope.resetExpertPwd = function(reset_id){
        $scope.message = '';
        
        Admin.resetExpertPassword(reset_id).success(function(data){
            $scope.message = data.message;
            
            //show an alert that the password has sucessfully changed or otherwise
            console.log($scope.message);
            return;
        });  
    };
    
    
    /**
     * This method archives an admin's account
     */
    $scope.archiveAdmin = function(admin_id, status){
        $scope.message = '';
        var data = {status: 'Inactive'};
        
        if(status === 'Active'){
            data.status = null;
        }
        
        Admin.archiveAdminAccount(admin_id, data).success(function(data){
            $scope.message = data.message;
            $scope.displayStatus(data.status);
            alert($scope.message);
        });  
    };
    
    /**
     * This method changes the color of the button that displays the user status
     */
    $scope.displayStatus = function(status){
        if(status === 'Active'){
            $scope.action = 'Archive';
        } else if(status === 'Inactive'){
            $scope.action = 'Restore';
        }
        return status === 'Active' ? 'btn btn-sm btn-info' : 'btn btn-sm btn-danger';     
    };
    
    $scope.clicked = function(obj, $event){
        if(obj.status === 'Active'){
            obj.status = 'Inactive';
        } else if(obj.status === 'Inactive'){
            obj.status = 'Active';
        }
    };
    
    /**
     * This method changes the color of the archive button
     */
    $scope.archiveBtnColor = function(status){
        return status === 'Active' ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-success';     
    };
    
});