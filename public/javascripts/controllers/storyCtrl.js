/* global angular */

var storyCtrl = angular.module('storyCtrl', []);

storyCtrl.controller('storyController', function($scope, Story, socketio){
    $scope.storyData = {content: ''};
    $scope.stories = [];
    $scope.message = '';
    
    angular.element(document).ready(function(){
        Story.getAll().success(function(data){
            angular.forEach(data, function(value, key){
                $scope.stories.push(value);
            });
        });
    });
    
    
    
    $scope.createStory = function(){
            Story.createStory($scope.storyData).success(function(data){
            $scope.message = data.message;
            $scope.storyData = {content: ''};
        });
    };
    
    
    socketio.on('story', function(data){
        $scope.stories.push(data);
    });
});