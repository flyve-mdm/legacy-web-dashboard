'use strict';
/**
* @ngdoc function
* @name FlyveMDM.controller:UsersAdminCtrl
* @description
* # UsersAdminCtrl
*
* + needs to grab the device names for users with the api
    using the user ids
*/
angular.module('FlyveMDM')
  .controller('UsersAdminCtrl', function (UsersAdminFac, AgentFac, AuthProvider, Notifications, $scope,
    $mdDialog) {
    // making use of the login Provider(Angular)
    // created for this project to represent the
    // "connection" to the Flyve/GLPi API
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    var usersControllerScope = $scope;
    $scope.displayedCollection = [];
    $scope.itemsByPage = 5;
    $scope.loading = false;
    $scope.fillTable = function (tableState) {
      UsersAdminFac.getUsers().then(function (users) {
        tableState.pagination.totalItemCount = $scope.collectionLength = users.length;
        AgentFac.evaluateDeviceNames(users).then(function (userCollection) {
          $scope.loading = false;
          $scope.displayedCollection = userCollection;
        }, function () {
        });
      }, function () {
      });
    };
    var EditUserController = function ($scope, $mdDialog, user) {
      $scope.lock_submit = false;
      $scope.input = angular.extend({}, user);
      $scope.saveUser = function () {
        $scope.lock_submit = true;
        UsersAdminFac.updateUser($scope.input)
          .then(function () {
            $mdDialog.hide().then(function () {
              Notifications.done("User edited");
              $scope.input.fullname = $scope.input.firstname + ' ' + $scope.input.lastname;
              $scope.input.password = '';
              $scope.input.password2 = '';
              usersControllerScope.displayedCollection.some(function (_user, index) {
                if (_user.id === $scope.input.id) {
                  usersControllerScope.displayedCollection[index] = angular.copy($scope.input);
                }
              });
            });
          });
      };
      $scope.cancel = function () {
        $mdDialog.hide();
      };
    };
    $scope.editUser = function (ev, user) {
      $mdDialog.show({
        controller: EditUserController,
        templateUrl: 'views/dialog_edituser.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        targetEvent: ev,
        locals: {
          user: user
        }
      });
    };
    $scope.deleteUser = function (ev, user) {
      $mdDialog.show(
        $mdDialog.confirm()
          .targetEvent(ev)
          .title('Confirm the deletion of user')
          .content('Are you certain to delete the ' + user.email + ' device')
          .ok('Accept')
          .cancel('Cancel')
      ).then(function () {
        UsersAdminFac.deleteUser(user.id).then(function () {
          Notifications.done("User deleted");
          usersControllerScope.displayedCollection.some(function (_user, index) {
            if (_user.id === user.id) {
              usersControllerScope.displayedCollection.splice(index, 1);
            }
          });
        });
      });
    };
    var RegistrationDialogCtrl = function ($scope, $mdDialog) {
      $scope.lock_submit = false;
      $scope.input = {
        username: '',
        password: '',
        password2: '',
        firstname: '',
        lastname: ''
      };
      $scope.attemptRegister = function () {
        $scope.lock_submit = true;
        var request = UsersAdminFac.attemptRegister($scope.input)
          .then(function (aUserId) {
            Notifications.done("User created");
            $scope.input.fullname = $scope.input.firstname + ' ' + $scope.input.lastname;
            if (navigator.credentials) {
              var credentials = new PasswordCredential({
                id: $scope.input.username,
                password: $scope.input.password,
                name: $scope.input.fullname
              });
              navigator.credentials.store(credentials);
            }
            $scope.input.id = aUserId;
            $scope.input.password = '';
            $scope.input.password2 = '';
            usersControllerScope.displayedCollection.push($scope.input);
          });
        request.finally(function () {
          $scope.lock_submit = false;
          $mdDialog.hide();
        });
      };
      $scope.cancel = function () {
        $mdDialog.hide();
      };
    };
    $scope.insertIntoTable = function (ev) {
      $mdDialog.show({
        controller: RegistrationDialogCtrl,
        templateUrl: 'views/dialog_register.html',
        targetEvent: ev,
        clickOutsideToClose: false
      });
    };
  });
