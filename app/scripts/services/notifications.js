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
 * @ngdoc service
 * @name FlyveMDM.Notifications
 * @description
 * # Notifications
 * Service in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .service('Notifications', function ($mdToast) {
    this.done = function (textContent) {
      var notificationEnable = localStorage.notificationEnable ? JSON.parse(localStorage.notificationEnable) : true;
      var notificationType = localStorage.notificationType ? localStorage.notificationType : 'Toast';
      if (notificationEnable) {
        switch (notificationType) {
          case 'Native':
            var options = {
              body: textContent,
              icon: 'images/stupid-user-avatar.png'
            };
            var n = new Notification('FlyveMDM', options);
            setTimeout(n.close.bind(n), 2000);
            return n;
          case 'Toast':
            var toast = $mdToast.simple()
              .textContent(textContent)
              .action('CLOSE')
              .highlightAction(true)
              .highlightClass('md-primary')
              .position('top right')
              .hideDelay(2000)
              .capsule(true);
            return $mdToast.show(toast);
        }
      }
    };
    this.loading = function (textContent, resolve) {
      var notificationEnable = localStorage.notificationEnable ? JSON.parse(localStorage.notificationEnable) : true;
      var notificationType = localStorage.notificationType ? localStorage.notificationType : 'Toast';
      if (notificationEnable) {
        switch (notificationType) {
          case 'Native':
            var options = {
              body: textContent,
              icon: 'images/stupid-user-avatar.png'
            };
            return new Notification('FlyveMDM', options);
          case 'Toast':
            var toast = $mdToast.simple()
              .textContent(textContent)
              .action('CANCEL')
              .highlightAction(true)
              .highlightClass('md-accent')
              .position('top right')
              .capsule(true)
              .hideDelay(false);
            $mdToast.show(toast).then(function (response) {
              if (response === 'ok') {
                if (resolve) {
                  resolve("User cancelled");
                }
              }
            });
        }
      }
    };
    this.error = function (textContent) {
      var notificationType = localStorage.notificationType ? localStorage.notificationType : 'Toast';
      switch (notificationType) {
        case 'Native':
          var options = {
            body: textContent,
            icon: 'images/stupid-user-avatar.png'
          };
          return new Notification('FlyveMDM', options);
        case 'Toast':
          var toast = $mdToast.simple()
            .textContent(textContent)
            .action('CLOSE')
            .highlightAction(true)
            .highlightClass('md-warn')
            .position('top right')
            .capsule(true)
            .hideDelay(false);
          return $mdToast.show(toast);
      }
    };
    this.update = function (textContent) {
      $mdToast.updateTextContent(textContent);
    };
    this.hide = function (textContent) {
      $mdToast.hide(textContent);
    };
  });
