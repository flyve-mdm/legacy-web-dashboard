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
 * @ngdoc overview
 * @name FlyveMDM
 * @description
 * # FlyveMDM
 *
 * Main module of the application.
 */
// App module declaration
angular.module('FlyveMDM', [
  'ngAnimate',
  'ngSanitize',
  'ui.router',
  'smart-table',
  'ngFileUpload',
  'ngMaterial',
  'ngMaterialAccordion',
  'chart.js'])
  // The routes for this application
  .config(function ($urlRouterProvider, $stateProvider, $mdThemingProvider, $httpProvider, $logProvider, $qProvider, ChartJsProvider, DEBUG) {
    $urlRouterProvider.otherwise('/');
    $qProvider.errorOnUnhandledRejections(false);
    $stateProvider
      // This state is triggered when you have to login on the system
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      // This state is triggered when the dashboard is displayed
      .state('dashboard', {
        url: '/',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      // This state is triggered when the account is displayed
      .state('account_page', {
        url: '/account',
        templateUrl: 'views/account.html',
        controller: 'UserPreferencesCtrl'
      })
      .state('invitation_logs', {
        url: '/admin/invitations/{id:int}/logs',
        templateUrl: 'views/invitationlogs.html',
        controller: 'InvitationLogsCtrl'
      })
      .state('account_validation', {
        url: '/account/{id:int}/validation/{hash:[0-9a-f]{64}}',
        templateUrl: 'views/accountvalidation.html',
        controller: 'AccountValidationCtrl'
      })
      .state('device', {
        url: "/admin/devices/{id:int}",
        templateUrl: 'views/device.html',
        controller: 'DeviceCtrl'
      })
      // This state is triggered when the device list is displayed
      .state('devices', {
        url: '/admin/devices',
        templateUrl: 'views/devices.html',
        controller: 'DevicesCtrl'
      })
      // This state is triggered when the device list is displayed
      .state('invitations', {
        url: '/admin/invitations',
        templateUrl: 'views/invitations.html',
        controller: 'InvitationsCtrl'
      })
      // This state is triggered when the fleets administration page is displayed
      .state('admin_fleets', {
        url: '/admin/fleets',
        templateUrl: 'views/admin_fleets.html',
        controller: 'FleetsAdminCtrl'
      })
      // This state is triggered when the files administration page is displayed
      .state('admin_files', {
        url: '/admin/files',
        templateUrl: 'views/admin_files.html',
        controller: 'FilesAdminCtrl'
      })
      // This state is triggered when the applications administration page is displayed
      .state('admin_applications', {
        url: '/admin/apps',
        templateUrl: 'views/admin_applications.html',
        controller: 'AppsAdminCtrl'
      })
      // This state is triggered when the users administration page is displayed
      .state('admin_users', {
        url: '/admin/users',
        templateUrl: 'views/admin_users.html',
        controller: 'UsersAdminCtrl'
      })
      // This state is the state triggered to display the "about" information page
      .state('about_page', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      // This state is the state triggered to display the "contact" form
      // Note: the form has to be specified, and the controller implemented
      .state('contact_teclib', {
        url: '/contact',
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })
      // This state is triggered when the help is displayed
      .state('help_page', {
        url: '/help',
        templateUrl: 'views/help.html'
      });
    // No behaviour has been really defined for the "help" button, is may ends
    // being an app tutorial, so there is no .state() for it atm.
    $logProvider.debugEnabled(DEBUG);

    $mdThemingProvider.theme('default')
      .primaryPalette('light-green')
      .accentPalette('light-blue');


    $mdThemingProvider.definePalette('petrole', {
      '50': '#b2f3f1',
      '100': '#70e9e6',
      '200': '#3fe1dd',
      '300': '#1dbcb8',
      '400': '#19a19e',
      '500': '#158784',
      '600': '#116c6a',
      '700': '#0d5250',
      '800': '#093836',
      '900': '#051d1c',
      'A100': '#b2f3f1',
      'A200': '#70e9e6',
      'A400': '#1FFFD9',
      'A700': '#00C2A1',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A200'
    });

    $mdThemingProvider.definePalette('gris', {
      '50': '#c4c3c3',
      '100': '#9e9c9c',
      '200': '#828080',
      '300': '#5e5c5c',
      '400': '#4e4d4d',
      '500': '#3f3e3e',
      '600': '#302f2f',
      '700': '#202020',
      '800': '#111010',
      '900': '#010101',
      'A100': '#c4c3c3',
      'A200': '#9e9c9c',
      'A400': '#4e4d4d',
      'A700': '#202020',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 A100 A200'
    });

    $mdThemingProvider.theme('flyve-mdm')
      .primaryPalette('petrole')
      .accentPalette('petrole')
      .warnPalette('gris')
      .backgroundPalette('gris');
    $mdThemingProvider.setDefaultTheme('flyve-mdm');

    /**
          $mdThemingProvider.theme('default')
            .primaryPalette('teal')
            .accentPalette('teal')
            .warnPalette('grey')
            .backgroundPalette('grey');
     */
    $mdThemingProvider
      .enableBrowserColor();

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    // Configure all charts
    ChartJsProvider.setOptions({
      chartColors: ['#3e3e3e', '#158784'],
      responsive: false,
      legend: {
        display: true,
        labels: {
          fontColor: '#4d4d4d',
          fontFamily: 'Open Sans',
          fontStyle: 'italic',
          boxWidth: 18,
          fontSize: 18
        }
      }
    });
    // Configure all line charts
    ChartJsProvider.setOptions('bar', {
      responsive: true,
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            min: 0,
            stepSize: 0.5
          }
        }]
      }
    });
  }).run(function ($rootScope) {
    var body = angular.element(document.body);
    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      if (toState.name === 'login') {
        body.addClass('hundred-percent-height-page');
      } else {
        body.removeClass('hundred-percent-height-page');
      }
    });
  });
