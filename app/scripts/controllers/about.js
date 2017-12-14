/**
 * ----------------------------------------------------------------------------
 * LICENSE
 *
 * This file is part of Flyve MDM Web Dashboard.
 *
 * Flyve MDM Web Dashboard is a subproject of Flyve MDM. Flyve MDM is a mobile
 * device management software.
 *
 * Flyve MDM Web Dashboard is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 *
 * Flyve MDM Web Dashboard is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * -----------------------------------------------------------------------------
 * @author    Alexander Salas - asalas@teclib.com
 * @copyright Copyright (c) 2017 Flyve MDM
 * @license   AGPLv3 https://www.gnu.org/licenses/agpl-3.0.html
 * @link      https://github.com/flyve-mdm/legacy-web-dashboard/
 * @link      http://www.glpi-project.org/
 * @link      https://flyve-mdm.com/
 * -----------------------------------------------------------------------------
 */

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
          var pluginPosition = $scope.pluginList.map(function (plugin) { return plugin.name; }).indexOf('flyvemdm');
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
