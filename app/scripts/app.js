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
  'ngGLPi',
  'ngMaterialAccordion',
  'chart.js'])
  // The routes for this application
  .config(function ($urlRouterProvider, $stateProvider, $mdThemingProvider, $httpProvider, $logProvider, $qProvider, ChartJsProvider, GlpiProvider, DEBUG) {
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
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    // Configure all charts
    ChartJsProvider.setOptions({
      chartColors: ['#8BC34A', '#03A9F4'],
      responsive: false,
      legend: {
        display: true,
        labels: {
          fontColor: '#093f52',
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
    // Configure Engine
    GlpiProvider.setOptions({
      global: {
        url: 'https://stork-mdm.com/glpi/apirest.php',
        user_token: 'J2Rf9zbnWzxTZ0wiHBI8'
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
