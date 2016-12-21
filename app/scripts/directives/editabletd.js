'use strict';
/**
 * @ngdoc directive
 * @name FlyveMDM.directive:editableTd
 * @description
 * # editableTd
 */
angular.module('FlyveMDM')
  .directive('editableTd', function () {
    return {
      restrict: 'A',
      template: '<span ng-hide="opened">{{value}}</span>' +
      '<form ng-submit="ctrl.updateValue()" ng-show="opened"><input type="text" ng-model="changedValue" /></form>',
      link: function postLink(scope, element, attrs, ctrl) {
        var input = element.find('input');
        // initializing initial value
        ctrl.setValue(scope.model()[scope.key]);
        // now binding the event handlers
        element.on('click', function () {
          if (!scope.opened) {
            scope.opened = true;
            scope.$apply();
            input.focus();
          }
        });
        // haviing the blur event as
        // a way to escape the edit
        // mode
        input.on('blur', function () {
          scope.opened = false;
          scope.changedValue = scope.value;
          scope.$apply();
        });
      },
      controller: function ($scope) {
        $scope.value = null;
        $scope.changedValue = null;
        $scope.opened = false;
        this.setValue = function (value) {
          // Yes, value and changedValue
          // are the same, before the Real
          // changedValue exists.
          $scope.value = value;
          $scope.changedValue = value;
        };
        this.updateValue = function () {
          $scope.value = $scope.changedValue;
          // now closing the stuff
          $scope.opened = false;
          // making $newValue available to
          // the editable-td-on-edit attribute
          $scope.$parent.$parent.$newValue = $scope.value;
          // running the compiled editable-td-on-edit
          $scope.onEdit()
            .then(function () {
              $scope.model()[$scope.key] = $scope.value;
            });
          // restoring the scope like it was
          delete $scope.$parent.$parent.$newValue;
        };
      },
      controllerAs: 'ctrl',
      scope: {
        "initValue": "=editableTdInitValue",
        "onEdit": "&editableTdOnEdit",
        "model": "&editableTdModel",
        "key": "=editableTdKey"
      }
    };
  });
