'use strict';

/**
 * @ngdoc service
 * @name FlyveMDM.software
 * @description
 * # software
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('software', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
