'use strict';
/**
 * @ngdoc directive
 * @name FlyveMDM.directive:faCarets
 * @description
 * # faCarets
 */
angular.module('FlyveMDM')
  .directive('faCarets', function () {
    return {
      template: '<i class="fa fa-caret-up"></i><i class="fa fa-caret-down"></i>',
      restrict: 'E'
    };
  });
