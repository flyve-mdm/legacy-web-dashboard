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
 * @name FlyveMDM.controller:UserPreferencesCtrl
 * @description
 * # UserPreferencesCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('UserPreferencesCtrl', function (GLPI_API_URL,
    AuthProvider, $state, $http, $scope,
    $rootScope, $mdDialog, GlpiObjectNames, PluginObjectNames,
    Notifications, EntityConfigFac, DashboardFac, FullSessionFac, UserPreferencesFac, UsersAdminFac, $interval, $q) {
    var prefsControllerScope = $scope;
    $scope.notificationMsg = 'For native you need to grant permissions';
    $scope.tokenLife = 0;
    $scope.selectedTab = 0;
    $scope.user = {};
    $scope.lock_language = false;
    $scope.lock_save_user = false;
    $scope.dashboard = {
      max_devices: false,
      devices: true,
      fleets: true,
      files: true,
      applications: true,
      users: true,
      invitations: true,
      devices_users: true,
      devices_os: true
    };
    for (var item in $scope.dashboard) {
      if (localStorage.getItem("dashboard_" + item)) {
        $scope.dashboard[item] = JSON.parse(localStorage.getItem("dashboard_" + item));
      }
    }
    var notificationEnable = localStorage.notificationEnable ? JSON.parse(localStorage.notificationEnable) : true;
    var notificationType = localStorage.notificationType ? localStorage.notificationType : 'Toast';
    $scope.notification = {
      type: notificationType,
      enable: notificationEnable
    };
    $scope.notifications = ['Toast', 'Native'];
    $scope.changeNotificatioType = function (aType) {
      if (aType === 'Native') {
        Notification.requestPermission().then(function (result) {
          switch (result) {
            case 'granted':
              $scope.notification.type = 'Native';
              localStorage.setItem('notificationType', 'Native');
              $scope.notificationMsg = 'Permission granted for native notifications';
              break;
            case 'denied':
              $scope.notification.type = 'Toast';
              localStorage.setItem('notificationType', 'Toast');
              $scope.notificationMsg = 'You need manage and re-allow notifications in your web browser';
              break;
            default:
              $scope.notification.type = 'Toast';
              localStorage.setItem('notificationType', 'Toast');
              $scope.notificationMsg = 'For native you need to grant permissions';
          }
        });
      } else {
        $scope.notification.type = 'Toast';
        localStorage.setItem('notificationType', 'Toast');
        $scope.notificationMsg = 'A toast provides simple feedback about an operation in a small popup';
      }
    };
    $scope.enableNotification = function (aState) {
      localStorage.setItem('notificationEnable', aState);
    };
    $scope.language = {
      name: '',
      code: ''
    };
    $scope.languages = [
      {
        name: 'English',
        code: 'en_US'
      },
      {
        name: 'French',
        code: 'fr_FR'
      },
      {
        name: 'Spanish',
        code: 'es_ES'
      },
      {
        name: 'Portuguese',
        code: 'pt_BR'
      }
    ];
    $scope.changeLanguage = function (language) {
      $scope.lock_language = true;
      UserPreferencesFac.changeLanguage($scope.user.id, language.code).then(function (response) {
        if (JSON.parse(response[0][$scope.user.id])) {
          Notifications.done("Language changed");
          $scope.lock_language = false;
          $scope.language = language;
        } else {
          $scope.lock_language = false;
        }
      }, function () {
        $scope.lock_language = false;
      });
    };
    var getActiveEntities = $http.get(GLPI_API_URL + GlpiObjectNames.ActiveEntities);
    // Find current entity in session data
    $q.all([getActiveEntities]).then(function (responses) {
      // get current entity configuration
      $scope.entityId = responses[0].data.active_entity.id;
      var getEntityconfig = EntityConfigFac.getConfiguration($scope.entityId);
      var getDevices = $http.get(
        GLPI_API_URL + GlpiObjectNames.Computer,
        { 'range': '0-0' }
      );
      return $q.all([getEntityconfig, getDevices]);
    }).then(function (responses) {
      var entityConfig = responses[0];
      var devices = responses[1];
      var devicesHeaders = devices.headers();
      var deviceCount = devicesHeaders['content-range'];
      if (typeof deviceCount !== 'undefined') {
        deviceCount = deviceCount.match(/^(\d+)-(\d+)\/(\d+)$/)[3];
      }
      $scope.deviceLimit = entityConfig.device_limit;
      $scope.deviceCount = deviceCount;
      $scope.downloadUrl = entityConfig.download_url;
      $scope.tokenLife = entityConfig.agent_token_life.match(/^P(\d+)D$/)[1];
    });
    $scope.deviceLimit = '';
    $scope.deviceCount = '';
    $scope.editTokenLife = function (ev) {
      var confirm = $mdDialog.prompt()
        .title('Date Period')
        .textContent('In number of days')
        .placeholder('Days')
        .ariaLabel('Date Period')
        .initialValue($scope.tokenLife)
        .targetEvent(ev)
        .ok('Save')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function (days) {
        $scope.tokenLife = days;
        var input = {
          agent_token_life: 'P' + $scope.tokenLife + 'D'
        };
        EntityConfigFac.editConfiguration($scope.entityId, input).then(function () {
          Notifications.done("Date period saved");
        });
      });
    };
    $scope.changeDownloadUrl = function (ev) {
      var confirm = $mdDialog.prompt()
        .title('URL of the application')
        .textContent('File extension as apk or upk')
        .placeholder('URL')
        .ariaLabel('URL of the application')
        .initialValue('https://')
        .targetEvent(ev)
        .ok('Save')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function (url) {
        $scope.downloadUrl = url;
        var input = {
          download_url: $scope.downloadUrl
        };
        EntityConfigFac.editConfiguration($scope.entityId, input).then(function () {
          Notifications.done("URL saved");
        });
      });
    };
    var promises = {
      invitations: DashboardFac.getInvitations(),
      users: DashboardFac.getNumberOfUsers(),
      devices: DashboardFac.getNumberOfDevices(),
      applications: DashboardFac.getNumberOfApplications(),
      fleets: DashboardFac.getNumberOfFleets(),
      files: DashboardFac.getNumberOfFiles(),
      policies: DashboardFac.getNumberOfPolicies(),
      categories: DashboardFac.getNumberOfPolicyCategories()
    };
    $q.all(promises).then(function (data) {
      $scope.usersCount = data.users;
      $scope.devicesCount = data.devices;
      $scope.applicationsCount = data.applications;
      $scope.fleetsCount = data.fleets;
      $scope.filesCount = data.files;
      $scope.policiesCount = data.policies;
      $scope.categoriesCount = data.categories;
      $scope.invitationsCount = data.invitations.total;
    });
    var getSession = FullSessionFac.getSession();
    getSession.then(function (response) {
      var session = response.getFullSession.data.session;
      $scope.user.id = session.glpiID;
      $scope.currentTime = session.glpi_currenttime;
      UserPreferencesFac.getUserInformation($scope.user.id).then(function (aUser) {
        $scope.user.username = aUser.name;
        $scope.user.phone = aUser.phone;
        $scope.user.phone2 = aUser.phone2;
        $scope.user.mobile = aUser.mobile;
        $scope.user.realname = aUser.realname;
        $scope.user.firstname = aUser.firstname;
        $scope.user.last_login = aUser.last_login;
        $scope.user.date_mod = aUser.date_mod;
        $scope.user.date_creation = aUser.date_creation;
        $scope.user.registration_number = aUser.registration_number;
        $scope.language.code = aUser.language;
        var languagePosition = $scope.languages.map(function (language) { return language.code; }).indexOf($scope.language.code);
        if (languagePosition !== -1) {
          $scope.language.name = $scope.languages[languagePosition].name;
        } else {
          $scope.language = {
            name: 'English',
            code: 'en_US'
          };
        }
      });
    });
    $scope.dashboardView = function () {
      for (var item in $scope.dashboard) {
        localStorage.setItem('dashboard_' + item, $scope.dashboard[item]);
      }
    };
    $scope.saveUser = function () {
      $scope.lock_save_user = true;
      UserPreferencesFac.updateUserInformation($scope.user).then(function (response) {
        if (JSON.parse(response[0][$scope.user.id])) {
          Notifications.done("User updated");
          $scope.lock_save_user = false;
        } else {
          $scope.lock_save_user = false;
        }
      }, function () {
        $scope.lock_save_user = false;
      });
    };
    var changePasswordController = function ($scope, $mdDialog,
      UserPreferencesFac) {
      $scope.user = angular.copy(prefsControllerScope.user);
      $scope.lock_submit = false;
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.changePassword = function () {
        $scope.lock_submit = true;
        UserPreferencesFac.updateMyPassword($scope.user.id, $scope.user.newPassword, $scope.user.newPassword2).then(function () {
          $mdDialog.hide();
          if (navigator.credentials) {
            var credential = new PasswordCredential({
              id: $scope.user.username,
              password: $scope.user.newPassword,
              name: $scope.user.firstname + ' ' + $scope.user.realname
            });
            navigator.credentials.store(credential);
          }
          Notifications.done("Password changed");
        }, function () {
          $scope.lock_submit = false;
        });
      };
    };
    $scope.changePassword = function (ev) {
      $mdDialog.hide().then(function () {
        $mdDialog.show({
          controller: changePasswordController,
          targetEvent: ev,
          templateUrl: 'views/dialog_changepassword.html',
          clickOutsideToClose: true
        });
      });
    };
    $scope.disconnect = function () {
      AuthProvider.logout().then(function () {
        AuthProvider.showLogin();
      });
    };
    $scope.deleteBrowserData = function () {
      AuthProvider.logout().then(function () {
        localStorage.clear();
        window.indexedDB.open('FlyveMDM').onsuccess = function (sender) {
          var r = sender.target.result;
          for (var i in r) {
            window.indexedDB.deleteDatabase(r[i]);
          }
        };
        AuthProvider.showLogin();
      });
    };
    $scope.deleteAccount = function () {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Please confirm account deletion')
          .content('Are you certain to delete the account?')
          .ariaLabel('delete account')
          .ok('Yes')
          .cancel('No')
      ).then(function () {
        UsersAdminFac.deleteUser($scope.user.id).then(function () {
          Notifications.done("Account deleted");
          AuthProvider.logout().then(function () {
            AuthProvider.showLogin();
          });
        });
      });
    };
  });
