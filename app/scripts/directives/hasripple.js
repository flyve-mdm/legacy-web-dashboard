'use strict';
/**
 * @ngdoc directive
 * @name FlyveMDM.directive:hasRipple
 * @description
 * # hasRipple
 */
angular.module('FlyveMDM')
  .directive('hasRipple', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs, ctrl) {
        ctrl.attachRipple(element);
      },
      controller: function ($scope, $mdInkRipple) {
        this.attachRipple = function (element) {
          $mdInkRipple.attach($scope, element, {
            fitRipple: true
          });
        };
      }
    };
  });
