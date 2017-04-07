(function () {
  'use strict';
  angular.module('appShell').filter('humanizeSection', function () {
    return function (section) {
      if (!section) {
        return;
      }
      return section.label || section.name;
    };
  });
})();