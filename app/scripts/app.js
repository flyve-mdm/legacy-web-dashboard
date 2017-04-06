'use strict';
angular.module('appShell',
  ['ngAnimate', 'ngAria', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngMaterial'],
  ['$routeProvider', '$locationProvider', '$mdThemingProvider', '$mdIconProvider', '$logProvider',
    function (
      $routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, $logProvider) {
      $locationProvider.html5Mode(true);
      $logProvider.debugEnabled(true);
      $routeProvider
        .when('/', {
          templateUrl: 'partials/home.tmpl.html'
        })
        .when('/settings/:tmpl', {
          templateUrl: function (params) {
            return 'partials/settings-' + params.tmpl + '.tmpl.html';
          }
        })
        .when('/settings/', {
          redirectTo: '/settings/entity'
        })
        .when('/dashboard', {
          templateUrl: 'partials/home.tmpl.html'
        })
        .when('/license', {
          templateUrl: 'partials/license.tmpl.html'
        });

      $mdIconProvider.icon('md-toggle-arrow', 'images/icons/toggle-arrow.svg', 48);

      $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('teal')
        .warnPalette('grey')
        .backgroundPalette('grey');

      $mdThemingProvider
        .enableBrowserColor();

      $routeProvider.otherwise('/');

      // Change hash prefix of the Angular router, because we use the hash symbol for anchor links.
      // The hash will be not used by the pages, because we use the HTML5 mode for our links.
      $locationProvider.hashPrefix('!');

    }])

  .factory('menu', [
    '$location',
    '$rootScope',
    '$log',
    function ($location, $rootScope) {
      var sections = [{
        name: 'Dashboard',
        url: 'dashboard',
        type: 'link'
      },
      {
        name: 'Devices',
        type: 'toggle',
        pages: [
          {
            name: 'Invitations',
            url: 'devices/invitations',
            type: 'link'
          },
          {
            name: 'Registered',
            url: 'devices/registered',
            type: 'link'
          }
        ]
      },
      {
        name: 'Administration',
        type: 'toggle',
        pages: [
          {
            name: 'Fleets',
            url: 'admin/fleets',
            type: 'link'
          },
          {
            name: 'Files',
            url: 'admin/files',
            type: 'link'
          },
          {
            name: 'Applications',
            url: 'admin/apps',
            type: 'link'
          },
          {
            name: 'Users',
            url: 'admin/users',
            type: 'link'
          }
        ]
      },
      {
        name: 'Settings',
        type: 'toggle',
        pages: [
          {
            name: 'Entity',
            url: 'settings/entity',
            type: 'link'
          },
          {
            name: 'Profile',
            url: 'settings/profile',
            type: 'link'
          },
          {
            name: 'Security',
            url: 'settings/security',
            type: 'link'
          },
          {
            name: 'Notifications',
            url: 'settings/notifications',
            type: 'link'
          },
          {
            name: 'Display',
            url: 'settings/display',
            type: 'link'
          },
          {
            name: 'Audit Trail',
            url: 'settings/logs',
            type: 'link'
          }
        ]
      },
      {
        name: 'Help',
        type: 'toggle',
        pages: [
          {
            name: 'Documentation',
            url: 'docs',
            type: 'link'
          },
          {
            name: 'Release Notes',
            url: 'changelog',
            type: 'link'
          },
          {
            name: 'Contact',
            url: 'contact',
            type: 'link'
          },
          {
            name: 'Terms of Use',
            url: 'tos',
            type: 'link'
          },
          {
            name: 'License',
            url: 'license',
            type: 'link'
          }
        ]
      }];
      var self = {
        sections: sections,

        selectSection: function (section) {
          self.openedSection = section;
        },
        toggleSelectSection: function (section) {
          self.openedSection = (self.openedSection === section ? null : section);
        },
        isSectionSelected: function (section) {
          return self.openedSection === section;
        },

        selectPage: function (section, page) {
          self.currentSection = section;
          self.currentPage = page;
        },
        isPageSelected: function (page) {
          return self.currentPage === page;
        }
      };

      function onLocationChange() {
        var path = $location.path();
        var introLink = {
          name: "Dashboard",
          url: "/",
          type: "link"
        };

        if (path === '/') {
          self.selectSection(introLink);
          self.selectPage(introLink, introLink);
          return;
        }

        var matchPage = function (section, page) {
          if (path.indexOf(page.url) !== -1) {
            self.selectSection(section);
            self.selectPage(section, page);
          }
        };

        sections.forEach(function (section) {
          if (section.children) {
            // matches nested section toggles, such as API or Customization
            section.children.forEach(function (childSection) {
              if (childSection.pages) {
                childSection.pages.forEach(function (page) {
                  matchPage(childSection, page);
                });
              }
            });
          }
          else if (section.pages) {
            // matches top-level section toggles, such as Demos
            section.pages.forEach(function (page) {
              matchPage(section, page);
            });
          }
          else if (section.type === 'link') {
            // matches top-level links, such as "Getting Started"
            matchPage(section, section);
          }
        });
      }
      $rootScope.$on('$locationChangeSuccess', onLocationChange);
      return self;
    }])
  .config(['$mdIconProvider', function ($mdIconProvider) {
    $mdIconProvider
      .iconSet('social', 'images/icons/sets/social-icons.svg', 24)
      .iconSet('actions', 'images/icons/sets/actions-icons.svg', 24)
      .iconSet('device', 'images/icons/sets/device-icons.svg', 24)
      .iconSet('communication', 'images/icons/sets/communication-icons.svg', 24)
      .defaultIconSet('images/icons/sets/core-icons.svg', 24);
  }])
  .filter('humanizeSection', function () {
    return function (section) {
      if (!section) {
        return;
      }
      return section.label || section.name;
    };
  });
