/* global angular */

var adminCtrl = angular.module('adminCtrl', ['adminService', 'ngAnimate']);

adminCtrl.controller('adminController', function($scope, $window, $location, Auth, Admin, socketio){
    
    /*Variables to be used to interact with the scope*/
    
    $scope.classes = [];
    $scope.admins = [];
    $scope.students = [];
    $scope.instructors = [];
    $scope.experts = [];
    $scope.error = '';

    //object that carries the details needed to create a new class.
    $scope.classData = {class_name: '', class_code: '', class_venue: '', class_time: '', class_duration: ''};

    //Object to carry the details needed to edit a class
    $scope.editClassData = {class_name: '', class_code: '', class_venue: '', class_time: {}, class_duration: ''};

    //object that holds the user's session data
    $scope.userData = {
        id: $window.sessionStorage.getItem('id'),
        first_name: $window.sessionStorage.getItem('first_name'),
        last_name: $window.sessionStorage.getItem('last_name'),
        user_type: $window.sessionStorage.getItem('user_type')
    };

    //object that holds the data for password changing
    $scope.adminData = {admin_id: '', old_password: '', new_password: ''};
    
    //array to hold the alerts to be displayed on the admin page
    $scope.alerts = [];

    //socket.io event listeners

    //listen for modification in classes.
    socketio.on('modifiedclass', function(data){
        
        //clear the classes array
        $scope.classes = [];

        //if a class is modified, repopulate the page to show the changes in real time
        Admin.getClasses().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes.push(value);
            });
        });
    });

    //listen for addition of new admins
    socketio.on('newadmin', function(data){
        $scope.admins.push(data);
    });

    //listen for addition of new instructors
    socketio.on('newinstructor', function(data){
        $scope.instructors.push(data);
    });

    //listen for addition of new classes
    socketio.on('newclass', function(data){
        $scope.classes.push(data);
    });


    /**
     * This function populates the scope arrays with the details of all users on page load
     */
    angular.element(document).ready(function(){

        //Get all classes available in the database
        Admin.getClasses().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.classes.push(value);
            });
        });

        //Get all admins in the database
        Admin.getAdmins().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.admins.push(value);
            });
        });

        //Get all instructors in the database.
        Admin.getInstructors().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.instructors.push(value);
            });
        });

        //Get all experts in the database
        /**Admin.getExperts().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.experts.push(value);
            });
        }); **/

        //Get all students in the database
        Admin.getStudents().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.students.push(value);
            });
        });
    });
    
    /**
     * This function utilizes the service method that creates a new class.
     *
     * @returns {void}
     */
    $scope.newClass = function(){
        Admin.addClass($scope.classData).success(function(data){
            $scope.classData = {class_name: '', class_code: '', class_venue: '', class_time: '', class_duration: ''};
        });
    };

    /**
     * This function utilizes the service method that edits a class.
     *
     * @returns {void}
     */
    $scope.editClass = function(){

       //get the values of the autoset textfields
        $scope.class_id = $('#class_id').val();
        $scope.editClassData.class_code = $('#class_code').val();
        $scope.editClassData.class_name = $('#class_name').val();
        $scope.editClassData.class_venue = $('#class_venue').val();
        $scope.editClassData.class_time = $('#class_time').val();
        $scope.editClassData.class_duration = $('#class_duration').val();
        
        //set the error variable to empty
        $scope.message = '';

        //call the service to edit the class
        Admin.editClassDetails($scope.class_id, $scope.editClassData).success(function(data){
            $scope.message = data.message;
            $scope.editClassData = {class_name: '', class_code: '', class_venue: '', class_time: {}, class_duration: ''};
        });
    };
    


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
            if(data.success){
                $scope.addAlert('success', $scope.message);
            } else {
                $scope.addAlert('danger', $scope.message);
            }
            
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
            if(data.success){
                $scope.addAlert('success', $scope.message);
            } else {
                $scope.addAlert('danger', $scope.message);
            }

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
            if(data.success){
                $scope.addAlert('success', $scope.message);
            } else {
                $scope.addAlert('danger', $scope.message);
            }

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
            if(data.success){
                $scope.addAlert('success', $scope.message);
            } else {
                $scope.addAlert('danger', $scope.message);
            }

            return;
        });  
    };
    
    
    /**
     * This method archives an admin's account
     *
     *@param{string} admin_id The id of the admin's account to be archived.
     *@param{string} status The status of the admin.
     *@return{void}  
     */
    $scope.archiveAdmin = function(admin_id, status){

        //set the variable that takes the server message to empty
        $scope.message = '';

        //initialize the status to inactive
        var data = {status: 'Inactive'}; //if status is inactive, the admin account will be restored, else it will be archived
        
        if(status === 'Active'){

            //if admin's status is active, set the status field to null.
            data.status = null;
        }
        
        //Call the service that archives/restores an admin's account, pass the admin's id and the current status as parameters
        Admin.archiveAdminAccount(admin_id, data).success(function(data){

            //set the scope message variable to the message received from the server
            $scope.message = data.message;

            //the the method the change the color of the buttons and the labels after status has changed.
            $scope.displayStatus(data.status);

            //alert the admin of the success of their change archiving/restoring action
            $scope.addAlert('success', $scope.message);
        });  
    };

    /**
     * This method archives an instructors's account
     *
     *@param{string} id The id of the instructor's account to be archived.
     *@param{string} status The status of the instructor.
     *@return{void}  
     */
    $scope.archiveInstructor = function(id, status){

        //set the variable that takes the server message to empty
        $scope.message = '';

        //initialize the status to inactive
        var data = {status: 'Inactive'}; //if status is inactive, the admin account will be restored, else it will be archived
        
        if(status === 'Active'){

            //if admin's status is active, set the status field to null.
            data.status = null;
        }
        
        //Call the service that archives/restores an admin's account, pass the admin's id and the current status as parameters
        Admin.archiveInstructorAccount(id, data).success(function(data){

            //set the scope message variable to the message received from the server
            $scope.message = data.message;

            //the the method the change the color of the buttons and the labels after status has changed.
            $scope.displayStatus(data.status);

            //alert the admin of the success of their change archiving/restoring action
            if(data.success){
                $scope.addAlert('success', $scope.message);
            } else {
                $scope.addAlert('danger', $scope.message);
            }
        });  
    };

    /**
     * This method archives an student's account
     *
     *@param{string} student_id The id of the student's account to be archived.
     *@param{string} status The status of the student.
     *@return{void}  
     */
    $scope.archiveStudent = function(student_id, status){

        //set the variable that takes the server message to empty
        $scope.message = '';

        //initialize the status to inactive
        var data = {status: 'Inactive'}; //if status is inactive, the admin account will be restored, else it will be archived
        
        if(status === 'Active'){

            //if admin's status is active, set the status field to null.
            data.status = null;
        }
        
        //Call the service that archives/restores an student's account, pass the student's id and the current status as parameters
        Admin.archiveStudentAccount(student_id, data).success(function(data){

            //set the scope message variable to the message received from the server
            $scope.message = data.message;

            //the the method the change the color of the buttons and the labels after status has changed.
            $scope.displayStatus(data.status);

            //alert the student of the success of their change archiving/restoring action
            $scope.addAlert('success', $scope.message);
        });  
    };

    
    /**
     * This method archives a class.
     *
     *@param{string} id The id of the class to be archived.
     *@param{string} status The current status of the class.
     *@return{void}  
     */
    $scope.archiveClass = function(id, status){

        //set the variable that takes the server message to empty
        $scope.message = '';

        //initialize the status to inactive
        var data = {status: 'Inactive'}; //if status is inactive, the admin account will be restored, else it will be archived
        
        if(status === 'Active'){

            //if admin's status is active, set the status field to null.
            data.status = null;
        }
        
        //Call the service that archives/restores a class, pass the class id and the current status as parameters
        Admin.archiveCls(id, data).success(function(data){

            //set the scope message variable to the message received from the server
            $scope.message = data.message;

            //the the method the change the color of the buttons and the labels after status has changed.
            $scope.displayStatus(data.status);

            //alert the admin of the success of their change archiving/restoring action
            if(data.success){
                $scope.addAlert('success', $scope.message);
            } else {
                $scope.addAlert('danger', $scope.message);
            }
        });  
    };

    /**
     * This method changes the color of the button that displays the user status
     */
    $scope.displayStatus = function(status){

        if(status === 'Active'){

            //Set the text to be displayed on the button to "Archive"
            $scope.action = 'Archive';
        } else if(status === 'Inactive'){

            //Set the text to be displayed on the button to "Restore"
            $scope.action = 'Restore';
        }

        //set the color of the button depending on the admin status
        return status === 'Active' ? 'btn btn-sm btn-info' : 'btn btn-sm btn-danger';     
    };
    
    /**
     *This method changes the admin status in the clicked row.
     *
     *@param{object} obj The whole object that is displayed in the table.
     *@param{event} $event A jQuery event that is fired on button click.
     */
    $scope.clicked = function(obj, $event){
        
        //toggle the admin status.
        if(obj.status === 'Active'){
            obj.status = 'Inactive';
        } else if(obj.status === 'Inactive'){
            obj.status = 'Active';
        }
    };
    
    /**
     * This method changes the color of the archive button
     *
     *@param{string} status The admin status.
     */
    $scope.archiveBtnColor = function(status){

        //change the button color depending on the admin status.
        return status === 'Active' ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-success';     
    };

    //variable that determines whether the sidebar is visible or not.
    $scope.isActive = false;

    //toggle the status of the isActive
    $scope.toggleCanvas = function(){
        $scope.isActive = !$scope.isActive;
    };

    //assign classes depending on whether the sidebar will be shown or not.
    $scope.canvasClass = function(){
        return $scope.isActive ? 'row row-offcanvas row-offcanvas-right active' : 'row row-offcanvas row-offcanvas-right';
    };
   
    /**
     *This function is used to push alerts onto the alerts array.
     */
    $scope.addAlert = function(type, message) {

        //add the new alert into the array of alerts to be displayed.
        $scope.alerts.push({type: type, msg: message});
    };

    /**
     *This function closes the alert
     */
    $scope.closeAlert = function(index) {
        
        //remove the alert from the array to avoid showing previous alerts
        $scope.alerts.splice(0); 
    };

});