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
    Agent: "/PluginFlyvemdmAgent",
    Entityconfig: "/PluginFlyvemdmEntityconfig",
    File: "/PluginFlyvemdmFile",
    Fleet: "/PluginFlyvemdmFleet",
    FleetPolicy: "/PluginFlyvemdmFleet_Policy",
    Geolocation: "/PluginFlyvemdmGeolocation",
    Invitation: "/PluginFlyvemdmInvitation",
    InvitationLog: "/PluginFlyvemdmInvitationLog",
    Application: "/PluginFlyvemdmPackage",
    Policy: "/PluginFlyvemdmPolicy",
    PolicyCategory: "/PluginFlyvemdmPolicyCategory",
    User: "/PluginFlyvemdmUser",
    WellknownPath: "/PluginFlyvemdmWellknownPath",
    AccountValidation: "/PluginFlyvemdmAccountvalidation"
  });
