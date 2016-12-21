'use strict';

/**
 * @ngdoc service
 * @name FlyveMDM.PluginObjectNames
 * @description
 * # PluginObjectNames
 * Constant in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .constant('PluginObjectNames', {
    Agent: "/PluginStorkmdmAgent",
    Entityconfig: "/PluginStorkmdmEntityconfig",
    File: "/PluginStorkmdmFile",
    Fleet: "/PluginStorkmdmFleet",
    FleetPolicy: "/PluginStorkmdmFleet_Policy",
    Geolocation: "/PluginStorkmdmGeolocation",
    Invitation: "/PluginStorkmdmInvitation",
    InvitationLog: "/PluginStorkmdmInvitationLog",
    Application: "/PluginStorkmdmPackage",
    Policy: "/PluginStorkmdmPolicy",
    PolicyCategory: "/PluginStorkmdmPolicyCategory",
    User: "/PluginStorkmdmUser",
    WellknownPath: "/PluginStorkmdmWellknownPath"
  });
