'use strict';
angular.module('mdmApp',
  ['ngAnimate', 'ngAria', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngMaterial', 'ngGLPi'],
  ['$routeProvider', '$locationProvider', '$mdThemingProvider', '$mdIconProvider', '$glpiProvider', '$logProvider',
    function (
      $routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, $glpiProvider, $logProvider) {
      // Configure Engine
      $glpiProvider.setOptions({
        global: {
          url: 'https://stork-mdm.com/glpi/apirest.php',
          user_token: 'q56hqkniwot8wntb3z1qarka5atf365taaa2uyjrn'
        }
      });
      $locationProvider.html5Mode(true);
      $logProvider.debugEnabled(true);
      $routeProvider
        .when('/', {
          templateUrl: 'partials/home.tmpl.html'
        })
        .when('/admin/:tmpl', {
          templateUrl: function (params) {
            return 'partials/admin-' + params.tmpl + '.tmpl.html';
          }
        })
        .when('/settings/:tmpl', {
          templateUrl: function (params) {
            return 'partials/settings-' + params.tmpl + '.tmpl.html';
          }
        })
        .when('/docs/:tmpl', {
          templateUrl: function (params) {
            return 'partials/docs-' + params.tmpl + '.tmpl.html';
          }
        })
        .when('/settings/', {
          redirectTo: '/settings/entity'
        })
        .when('/docs/', {
          redirectTo: '/docs/getting-started'
        })
        .when('/devices/', {
          redirectTo: '/devices/registered'
        })
        .when('/devices/registered', {
          templateUrl: 'partials/devices.tmpl.html'
        })
        .when('/devices/invitations', {
          templateUrl: 'partials/invitations.tmpl.html'
        })
        .when('/overview', {
          templateUrl: 'partials/about.tmpl.html'
        })
        .when('/dashboard', {
          templateUrl: 'partials/home.tmpl.html'
        })
        .when('/changelog', {
          templateUrl: 'partials/changelog.tmpl.html'
        })
        .when('/contact', {
          templateUrl: 'partials/contact.tmpl.html'
        })
        .when('/tos', {
          templateUrl: 'partials/tos.tmpl.html'
        })
        .when('/license', {
          templateUrl: 'partials/license.tmpl.html'
        });

      $mdIconProvider.icon('md-toggle-arrow', 'images/icons/toggle-arrow.svg', 48);

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

      $routeProvider.otherwise('/');

      // Change hash prefix of the Angular router, because we use the hash symbol for anchor links.
      // The hash will be not used by the pages, because we use the HTML5 mode for our links.
      $locationProvider.hashPrefix('!');

    }])

  .factory('menu', [
    '$location',
    '$rootScope',
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
      /*
                  sections.push({
                      name: 'License',
                      url: 'license',
                      type: 'link',

                      // Add a hidden section so that the title in the toolbar is properly set
                      hidden: true
                  },
                      {
                          name: 'Terms and Conditions of Use',
                          url: 'tos',
                          type: 'link',
                          hidden: true
                      });
      */
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

  .directive('menuLink', function () {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-link.tmpl.html',
      link: function ($scope, $element) {
        var controller = $element.parent().controller();

        $scope.isSelected = function () {
          return controller.isSelected($scope.section);
        };

        $scope.focusSection = function () {
          // set flag to be used later when
          // $locationChangeSuccess calls openPage()
          controller.autoFocusContent = true;
        };
      }
    };
  })

  .directive('menuToggle', ['$mdUtil', '$animateCss', '$$rAF', function ($mdUtil, $animateCss, $$rAF) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-toggle.tmpl.html',
      link: function ($scope, $element) {
        var controller = $element.parent().controller();

        // Used for toggling the visibility of the accordion's content, after
        // all of the animations are completed. This prevents users from being
        // allowed to tab through to the hidden content.
        $scope.renderContent = false;

        $scope.isOpen = function () {
          return controller.isOpen($scope.section);
        };

        $scope.toggle = function () {
          controller.toggleOpen($scope.section);
        };

        $mdUtil.nextTick(function () {
          $scope.$watch(function () {
            return controller.isOpen($scope.section);
          }, function (open) {
            var $ul = $element.find('ul');
            //var $li = $ul[0].querySelector('a.active');

            if (open) {
              $scope.renderContent = true;
            }

            $$rAF(function () {
              var targetHeight = open ? $ul[0].scrollHeight : 0;

              $animateCss($ul, {
                easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
                to: { height: targetHeight + 'px' },
                duration: 0.75 // seconds
              }).start().then(function () {
                var $li = $ul[0].querySelector('a.active');

                $scope.renderContent = open;

                if (open && $li && $ul[0].scrollTop === 0) {
                  var activeHeight = $li.scrollHeight;
                  var activeOffset = $li.offsetTop;
                  var offsetParent = $li.offsetParent;
                  var parentScrollPosition = offsetParent ? offsetParent.offsetTop : 0;

                  // Reduce it a bit (2 list items' height worth) so it doesn't touch the nav
                  var negativeOffset = activeHeight * 2;
                  var newScrollTop = activeOffset + parentScrollPosition - negativeOffset;

                  $mdUtil.animateScrollTo(document.querySelector('.app-menu').parentNode, newScrollTop);
                }
              });
            });
          });
        });

        var parentNode = $element[0].parentNode.parentNode.parentNode;
        if (parentNode.classList.contains('parent-list-item')) {
          var heading = parentNode.querySelector('h2');
          $element[0].firstChild.setAttribute('aria-describedby', heading.id);
        }
      }
    };
  }])
  .controller('AgentsCtrl', [
    '$scope',
    'GLPi',
    'pluginEndPoints',
    '$timeout',
    function ($scope, GLPi, pluginEndPoints, $timeout) {
      console.log(GLPi.getOptions('defaults').global.url);
      console.log(GLPi.getOptions('defaults').global.user_token);
      console.log(pluginEndPoints.AGENT);
      $scope.items = [];
      var range = { from: 0, to: 15 };
      GLPi.getAllItems(pluginEndPoints.AGENT, range).then(function (agents) {
        console.log(agents.contentRange);
        var toLoad = range.to;
        var agentsLength = agents.data.length;
        if (agents.contentRange.total < toLoad) {
          toLoad = agentsLength;
        }
        agents.data.forEach(function (agent) {
          $scope.items.push({
            name: agent.name,
            computer_model: agent.computers_id
          });
        });
        $scope.infiniteItems = {
          numLoaded_: agentsLength,
          toLoad_: toLoad,
          getItemAtIndex: function (index) {
            if (index === this.numLoaded_) {
              this.fetchMoreItems_(index);
              return null;
            }
            return index;
          },
          getLength: function () {
            if (agentsLength >= range.to) {
              return this.numLoaded_ + 10;
            } else {
              return this.numLoaded_;
            }
          },
          fetchMoreItems_: function (index) {
            console.log("numLoaded_: " + this.numLoaded_);
            console.log("toLoad_: " + this.numLoaded_);
            console.log("index: " + index);
            if (this.toLoad_ === index && agentsLength >= range.to) {
              this.toLoad_ += range.to;
              $timeout(angular.noop, 1000).then(angular.bind(this, function () {
                this.numLoaded_ = this.toLoad_;
              }));
            }
          }
        };
        console.log($scope.infiniteItems);
      }, function (error) {
        console.error(error);
      });

      /**
      GLPi.initsession('user_token').then(function (resp) {
        console.log(resp);
      });

      GLPi.initsession('basic', { login: 'wnouh@teclib.com', password: 'teclib' }).then(function (resp) {
        console.log(resp);
      }, function (error) {
        console.log(error);
      });
      */
      //GLPi.listSearchOptions('PluginStorkmdmAgent');

    }
  ])
  .factory('DynamicItems', [
    '$q',
    'GLPi',
    function ($q, GLPi) {
      return function (itemType, params) {
        var responseDefer = $q.defer();
        var range = [{ from: 0, to: 29 }];
        params.uid_cols = true;
        params.range = range[0].from + '-' + range[0].to;
        GLPi.searchItems(itemType, params).then(function (response) {
          var dataTotal = response.totalcount;
          var PAGE_SIZE = 15;
          var numberOfPages = Math.ceil(dataTotal / PAGE_SIZE);
          var lastPageLoaded = 0;
          for (var i = 3; i <= numberOfPages; i++) {
            range.push({ from: PAGE_SIZE * (i - 1), to: PAGE_SIZE * i - 1 });
          }
          range[range.length - 1].to = response.totalcount - 1;
          var infiniteItems = {
            data: response.data,
            getItemAtIndex: function (index) {
              if (index === range[lastPageLoaded].to && lastPageLoaded + 1 < range.length) {
                lastPageLoaded++;
                params.range = range[lastPageLoaded].from + '-' + range[lastPageLoaded].to;
                GLPi.searchItems(itemType, params).then(function (response) {
                  Array.prototype.push.apply(this.data, response.data);
                }.bind(this));
              }
              return index;
            },
            getLength: function () {
              return this.data.length;
            }
          };
          responseDefer.resolve(infiniteItems);
        });
        return responseDefer.promise;
      };
    }])
  .controller('FleetsCtrl', [
    '$q',
    '$scope',
    '$element',
    'GLPi',
    'DynamicItems',
    'pluginEndPoints',
    '$timeout',
    '$mdDialog',
    function ($q, $scope, $element, GLPi, DynamicItems, pluginEndPoints) {
      console.log(GLPi.getOptions('defaults').global.url);
      console.log(GLPi.getOptions('defaults').global.user_token);
      var params = {
        'forcedisplay[0]': 1,
        'forcedisplay[1]': 2,
        'forcedisplay[2]': 5,
        order: 'DESC',
        sort: 5
      };
      DynamicItems(pluginEndPoints.FLEET, params).then(function (infiniteItems) {
        $scope.infiniteItems = infiniteItems;
      });

      $scope.items = [];
      for (var i = 0; i < 1000; i++) {
        $scope.items.push(i);
      }
      $scope.sortItems = ['ID', 'Name', 'Not managed'];
      $scope.selectedItem = 'ID';
      $scope.selectedItemDir = 'Descending';
      $scope.getSelectedText = function () {
        if ($scope.selectedItem !== undefined) {
          return "Sorted by " + $scope.selectedItem;
        } else {
          return "Sort by";
        }
      };
      $scope.vegetables = ['ID', 'Name', 'Not managed'];
      $scope.selectedVegetables = ['ID', 'Name'];
      $scope.searchTerm = '';
      $scope.clearSearchTerm = function () {
        $scope.searchTerm = '';
      };
      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      $element.find('input').on('keydown', function (ev) {
        ev.stopPropagation();
      });
      $scope.getSelectedTextDir = function () {
        if ($scope.selectedItemDir !== undefined) {
          return $scope.selectedItemDir + ' Order';
        } else {
          return "Arrange in";
        }
      };
      $scope.subheader = "127 fleets showing the fields ID, Name, Default sorted by ID and with descending order."
      /**
      GLPi.initsession('user_token').then(function (resp) {
        console.log(resp);
      });

      GLPi.initsession('basic', { login: 'wnouh@teclib.com', password: 'teclib' }).then(function (resp) {
        console.log(resp);
      }, function (error) {
        console.log(error);
      });
      */
      //GLPi.listSearchOptions('PluginStorkmdmAgent');

      $scope.doSecondaryAction = function ($event) {
        $event.stopPropagation();
        $event.preventDefault();
      };

    }
  ])
  .directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('click', function (e) {
          e.stopPropagation();
        });
      }
    };
  })
  .config(['$mdIconProvider', function ($mdIconProvider) {
    $mdIconProvider
      .iconSet('social', 'images/icons/sets/social-icons.svg', 24)
      .iconSet('actions', 'images/icons/sets/actions-icons.svg', 24)
      .iconSet('device', 'images/icons/sets/device-icons.svg', 24)
      .iconSet('communication', 'images/icons/sets/communication-icons.svg', 24)
      .defaultIconSet('images/icons/sets/core-icons.svg', 24);
  }])
  .controller('ListCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
    $scope.toppings = [
      { name: 'Pepperoni', wanted: true },
      { name: 'Sausage', wanted: false },
      { name: 'Black Olives', wanted: true },
      { name: 'Green Peppers', wanted: false }
    ];

    $scope.settings = [
      { name: 'Wi-Fi', extraScreen: 'Wi-fi menu', icon: 'device:network-wifi', enabled: true },
      { name: 'Bluetooth', extraScreen: 'Bluetooth menu', icon: 'device:bluetooth', enabled: false },
    ];

    $scope.messages = [
      { id: 1, title: "Message A", selected: false },
      { id: 2, title: "Message B", selected: true },
      { id: 3, title: "Message C", selected: true },
    ];

    $scope.people = [
      { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
      { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
      { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
    ];

    $scope.goToPerson = function (person, event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Navigating')
          .textContent('Inspect ' + person)
          .ariaLabel('Person inspect demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };

    $scope.navigateTo = function (to, event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Navigating')
          .textContent('Imagine being taken to ' + to)
          .ariaLabel('Navigation demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };

    $scope.doPrimaryAction = function (event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Primary Action')
          .textContent('Primary actions can be used for one click actions')
          .ariaLabel('Primary click demo')
          .ok('Awesome!')
          .targetEvent(event)
      );
    };

    $scope.doSecondaryAction = function (event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Secondary Action')
          .textContent('Secondary actions can be used for one click actions')
          .ariaLabel('Secondary click demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };

  }])
  .controller('AppCtrl', [
    '$scope',
    '$mdSidenav',
    '$timeout',
    '$mdDialog',
    'menu',
    '$location',
    '$rootScope',
    '$mdUtil',
    function ($scope, $mdSidenav, $timeout, $mdDialog, menu, $location, $rootScope, $mdUtil) {
      var self = this;
      var mainContentArea = document.querySelector("[role='main']");
      var scrollContentEl = mainContentArea.querySelector('md-content[md-scroll-y]');
      // *********************
      // Internal methods
      // *********************

      function closeMenu() {
        $timeout(function () { $mdSidenav('left').close(); });
      }

      function openMenu() {
        $timeout(function () { $mdSidenav('left').open(); });
      }

      function path() {
        return $location.path();
      }

      function scrollTop() {
        $mdUtil.animateScrollTo(scrollContentEl, 0, 200);
      }

      function goHome() {
        menu.selectPage(null, null);
        $location.path('/');
      }

      function focusMainContent($event) {
        // prevent skip link from redirecting
        if ($event) { $event.preventDefault(); }

        $timeout(function () {
          mainContentArea.focus();
        }, 90);

      }

      function openPage() {
        $scope.closeMenu();

        if (self.autoFocusContent) {
          focusMainContent();
          self.autoFocusContent = false;
        }
      }

      function isSelected(page) {
        return menu.isPageSelected(page);
      }

      function isSectionSelected(section) {
        var selected = false;
        var openedSection = menu.openedSection;
        if (openedSection === section) {
          selected = true;
        }
        else if (section.children) {
          section.children.forEach(function (childSection) {
            if (childSection === openedSection) {
              selected = true;
            }
          });
        }
        return selected;
      }

      function isOpen(section) {
        return menu.isSectionSelected(section);
      }

      function toggleOpen(section) {
        menu.toggleSelectSection(section);
      }
      $scope.menu = menu;

      $scope.path = path;
      $scope.goHome = goHome;
      $scope.openMenu = openMenu;
      $scope.closeMenu = closeMenu;
      $scope.isSectionSelected = isSectionSelected;
      $scope.scrollTop = scrollTop;

      // Grab the current year so we don't have to update the license every year
      $scope.thisYear = (new Date()).getFullYear();

      $rootScope.$on('$locationChangeSuccess', openPage);
      $scope.focusMainContent = focusMainContent;

      //-- Define a fake model for the related page selector
      Object.defineProperty($rootScope, "relatedPage", {
        get: function () { return null; },
        set: angular.noop,
        enumerable: true,
        configurable: true
      });

      $rootScope.redirectToUrl = function (url) {
        $location.path(url);
        $timeout(function () { $rootScope.relatedPage = null; }, 100);
      };

      // Methods used by menuLink and menuToggle directives
      this.isOpen = isOpen;
      this.isSelected = isSelected;
      this.toggleOpen = toggleOpen;
      this.autoFocusContent = false;
    }])

  .filter('nospace', function () {
    return function (value) {
      return (!value) ? '' : value.replace(/ /g, '');
    };
  })

  .filter('humanizeSection', function () {
    return function (section) {
      if (!section) { return; }
      return section.label || section.name;
    };
  })

  /** Directive which applies a specified class to the element when being scrolled */
  .directive('appScrollClass', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {

        var scrollParent = element.parent();
        var isScrolling = false;

        function updateState() {
          var newState = scrollParent[0].scrollTop !== 0;

          if (newState !== isScrolling) {
            element.toggleClass(attr.appScrollClass, newState);
          }

          isScrolling = newState;
        }

        // Initial update of the state.
        updateState();

        // Register a scroll listener, which updates the state.
        scrollParent.on('scroll', updateState);
      }
    };
  })
  .directive('mdToolbarVirtual', ['$$rAF', '$mdConstant', '$mdUtil', '$mdTheming', '$animate', function mdToolbarVirtualDirective($$rAF, $mdConstant, $mdUtil, $mdTheming, $animate) {
    var translateY = angular.bind(null, $mdUtil.supplant, 'translate3d(0,{0}px,0)');
    return {
      template: '',
      restrict: 'E',
      link: function (scope, element, attr) {
        element.addClass('_md');
        $mdTheming(element);
        $mdUtil.nextTick(function () {
          element.addClass('_md-toolbar-transitions');
        }, false);
        function setupScrollShrink() {
          var toolbarHeight;
          var contentElement;
          var containerElement;
          var disableScrollShrink = angular.noop;
          var y = 0;
          var prevScrollTop = 0;
          var shrinkSpeedFactor = attr.mdShrinkSpeedFactor || 0.5;
          function onContentScroll(e) {
            var scrollTop = e ? e.target.scrollTop : prevScrollTop;
            y = Math.min(
              toolbarHeight / shrinkSpeedFactor,
              Math.max(0, y + scrollTop - prevScrollTop)
            );
            element.css($mdConstant.CSS.TRANSFORM, translateY([-y * shrinkSpeedFactor]));
            contentElement.css($mdConstant.CSS.TRANSFORM, translateY([(toolbarHeight - y) * shrinkSpeedFactor]));
            containerElement.css($mdConstant.CSS.TRANSFORM, translateY([(toolbarHeight - y) * shrinkSpeedFactor]));
            prevScrollTop = scrollTop;
            $mdUtil.nextTick(function () {
              var hasWhiteFrame = element.hasClass('md-whiteframe-z1');

              if (hasWhiteFrame && !y) {
                $animate.removeClass(element, 'md-whiteframe-z1');
              } else if (!hasWhiteFrame && y) {
                $animate.addClass(element, 'md-whiteframe-z1');
              }
            });
          }
          function updateToolbarHeight() {
            toolbarHeight = element.prop('offsetHeight');
            var margin = (-toolbarHeight * shrinkSpeedFactor) + 'px';
            contentElement.css({
              "margin-top": margin,
              "margin-bottom": margin
            });
            onContentScroll();
          }
          var debouncedContentScroll = $$rAF.throttle(onContentScroll);
          var debouncedUpdateHeight = $mdUtil.debounce(updateToolbarHeight, 5 * 1000);
          debouncedUpdateHeight();
          function enableScrollShrink() {
            console.log(contentElement);
            if (!contentElement) { return angular.noop; }
            contentElement.on('scroll', debouncedContentScroll);
            contentElement.attr('scroll-shrink', 'true');
            $mdUtil.nextTick(updateToolbarHeight, false);
            return function disableScrollShrink() {
              contentElement.off('scroll', debouncedContentScroll);
              contentElement.attr('scroll-shrink', 'false');
              updateToolbarHeight();
            };
          }
          function onMdContentLoad($event, newContentEl) {
            if (contentElement) {
              contentElement.off('scroll', debouncedContentScroll);
            }
            contentElement = newContentEl;
            disableScrollShrink = enableScrollShrink();
          }
          scope.$on('$mdContentLoaded', onMdContentLoad);
          if (attr.ngShow) { scope.$watch(attr.ngShow, updateToolbarHeight); }
          if (attr.ngHide) { scope.$watch(attr.ngHide, updateToolbarHeight); }
          scope.$on('$destroy', disableScrollShrink);
          function onChangeScrollShrink(shrinkWithScroll) {
            contentElement = angular.element(document.querySelector('.md-virtual-repeat-scroller'));
            containerElement = angular.element(document.querySelector('md-virtual-repeat-container'));
            shrinkWithScroll = scope.$eval(shrinkWithScroll);
            if (shrinkWithScroll === false) {
              disableScrollShrink();
            } else {
              disableScrollShrink = enableScrollShrink();
            }
          }
          attr.$observe('mdScrollShrink', onChangeScrollShrink);
        }
        if (angular.isDefined(attr.mdScrollShrink)) {
          setupScrollShrink();
        }
      }
    };
  }]);
