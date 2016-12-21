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
