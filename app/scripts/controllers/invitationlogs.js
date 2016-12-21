'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:InvitationLogsCtrl
 * @description
 * # InvitationLogsCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('InvitationLogsCtrl', function (GLPI_API_URL,
    AuthProvider, InvitationsFac, InvitationLogsFac, UsersAdminFac, $stateParams, $scope) {
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    $scope.displayedInvitationLogs = [];
    $scope.invitation_email = "Loading...";
    $scope.loading = false;
    InvitationsFac.getInvitation($stateParams.id).then(function (anInvitation) {
      UsersAdminFac.getUser(anInvitation.users_id).then(function (aUser) {
        $scope.invitation_email = aUser.username;
      });
    });
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
      InvitationLogsFac.getLogs($stateParams.id).then(function (logs) {
        $scope.loading = false;
        $scope.displayedInvitationLogs = logs;

        tableState.pagination.totalItemCount = logs.length;
      });
    };
  });
