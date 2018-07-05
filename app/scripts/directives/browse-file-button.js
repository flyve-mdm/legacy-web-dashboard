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
