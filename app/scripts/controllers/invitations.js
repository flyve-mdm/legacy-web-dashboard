'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:InvitationsCtrl
 * @description
 * # InvitationsCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('InvitationsCtrl', function (GLPI_API_URL,
    AuthProvider, InvitationsFac, Notifications, $scope, $state, $mdDialog) {
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    var devicesControllerScope = $scope;
    $scope.displayedInvitations = [];
    $scope.collectionLength = 0;
    $scope.itemsByPage = 5;
    $scope.loading = false;
    /**
     * -- DEVICE-LISTING/PAGINATION RELATED
     */
    var smartTableTableState = null;
    $scope.fillTable = function (tableState) {
      // saving reference of the tableState
      if (smartTableTableState === null) {
        smartTableTableState = tableState;
      }
      $scope.loading = true;
      InvitationsFac.getInvitations().then(function (response) {
        $scope.loading = false;
        $scope.displayedInvitations = response.getInvitations.map(function (invitation) {
          var userPosition = response.getUsers.data.map(function (user) { return user.id; }).indexOf(invitation.users_id);
          if (userPosition !== -1) {
            invitation.user_email = response.getUsers.data[userPosition].name;
          }
          return invitation;
        });
        $scope.displayedInvitations = response.getInvitations;
        $scope.collectionLength = response.getInvitations.length;
        tableState.pagination.totalItemCount = response.getInvitations.length;
      });
    };
    /**
     * -- Add new device method
     */
    var EnrollNewDeviceController = function ($scope, $mdDialog) {
      $scope.lock_submit = false;
      $scope.user_email = "";
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.enrollDevice = function () {
        $scope.lock_submit = true;
        InvitationsFac.enrollNewDevice($scope.user_email)
          .then(function (invitationId) {
            $mdDialog.hide().then(function () {
              Notifications.done("Invitation requested");
              var invitation = {
                id: invitationId,
                user_email: $scope.user_email
              };
              devicesControllerScope.displayedInvitations.push(invitation);
            });
          });
      };
    };
    $scope.insertIntoTable = $scope.enrollNewDevice = function () {
      $mdDialog.show({
        controller: EnrollNewDeviceController,
        templateUrl: 'views/dialog_enrollnewdevice.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
      });
    };
    $scope.resendEmail = function (device) {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Resend invitation #' + device.id)
          .content('You are going to resend email ' + device.user_email + '.')
          .ariaLabel('Resend this email')
          .ok('Accept')
          .cancel('Cancel')
      ).then(function () {
        InvitationsFac.resendInvitation(device.id, device.user_email).then(function () {
          Notifications.done("Resend invitation requested");
        });
      });
    };
    $scope.invitationLogs = function (invitationId) {
      $state.go('invitation_logs', { id: invitationId });
    };
    $scope.deleteEmail = function (device) {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Delete invitation #' + device.id)
          .content('You are going to delete email ' + device.user_email + '.')
          .ariaLabel('Delete this email')
          .ok('Accept')
          .cancel('Cancel')
      ).then(function () {
        InvitationsFac.deleteInvitation(device.id).then(function () {
          Notifications.done("Invitation deleted");
          devicesControllerScope.displayedInvitations.some(function (_device, index) {
            if (_device.id === device.id) {
              devicesControllerScope.displayedInvitations.splice(index, 1);
              return true;
            }
          });
        });
      });
    };
  });
