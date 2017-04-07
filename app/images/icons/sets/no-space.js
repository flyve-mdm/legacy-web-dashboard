(function () {
  'use strict';
  angular.module('appShell').filter('nospace', function () {
    return function (value) {
      return (!value) ? '' : value.replace(/ /g, '');
    };
  });
})();