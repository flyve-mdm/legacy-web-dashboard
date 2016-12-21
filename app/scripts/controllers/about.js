'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('AboutCtrl', function (GLPI_API_URL, PACKAGE, BOWER, DEBUG, BUILD_ID, UserPreferencesFac, $scope) {
    $scope.overview = BOWER.description;
    $scope.debug = DEBUG;
    $scope.components = [];
    UserPreferencesFac.getGLPiVersion().then(function (version) {
      $scope.glpiVersion = version;
    });

    UserPreferencesFac.getPluginList().then(function (list) {
      $scope.pluginList = [];
      list.forEach(function (plugin) {
        $scope.pluginList.push({
          name: plugin,
          version: null
        });
        UserPreferencesFac.getPluginVersion().then(function (version) {
          var pluginPosition = $scope.pluginList.map(function (plugin) { return plugin.name; }).indexOf('storkmdm');
          if (pluginPosition !== -1) {
            $scope.pluginList[pluginPosition].version = version;
          }
        });
      });
    });
    for (var dependency in BOWER.dependencies) {
      $scope.components.push({
        name: dependency,
        version: BOWER.dependencies[dependency].replace(/\^/g, '')
      });
    }
    $scope.webAppVersion = BOWER.version;
    $scope.build = BUILD_ID;
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.angularVersion = angular.version.full;
  });
