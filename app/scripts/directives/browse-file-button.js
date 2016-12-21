'use strict';
/**
 * @ngdoc directive
 * @name FlyveMDM.directive:browseFileButton
 * @description
 * # browseFileButton
 */
angular.module('FlyveMDM')
  .directive('browseFileButton', function () {
    return {
      restrict: 'E',
      template: '<md-button class="md-raised browse-button">Upload File <i class="fa fa-chevron-right"></i></md-button>' +
      '<input type="file" class="browse-button-real" ngf-select ng-model="model" />' +
      '<div class="current-file">{{model.name}}</div>',
      link: function postLink(scope, element) {
        var trigger = element.find('.browse-button');
        var realBrowseButton = element.find('.browse-button-real');
        trigger.on('click', function () {
          realBrowseButton.click();
        });
      },
      scope: {
        model: "=model"
      }
    };
  });
