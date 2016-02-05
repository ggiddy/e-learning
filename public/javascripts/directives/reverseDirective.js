/* global angular */

var reverseDirective = angular.module('reverse', []);

reverseDirective.filter('reverse', function(){
    return function(items){
        return items.slice().reverse();
    };
});