'use strict';

/**
 * @ngdoc service
 * @name FlyveMDM.PoliciesAdminFac
 * @description
 * # PoliciesAdminFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('PoliciesAdminFac', function (GLPI_API_URL, PluginObjectNames, $q, $http) {
    // Service logic
    var policies = [];
    var categories = [];
    var deployApp = "deployApp";
    var removeApp = "removeApp";
    function findPolicyBySymbol(policiesArray, aSymbol) {
      var policyToDeployAppPos = policiesArray.map(function (x) { return x.symbol; })
        .indexOf(aSymbol);
      var policyToDeployAppFound = policiesArray[policyToDeployAppPos];
      return policyToDeployAppFound.id;
    }
    function findPolicy(aPolicyId) {
      var policyPosition = policies.map(function (x) { return x.id; })
        .indexOf(aPolicyId);
      var policyFound = policies[policyPosition];
      return policyFound;
    }
    function findCategory(aCategoryId) {
      var categoryPosition = categories.map(function (x) { return x.id; })
        .indexOf(aCategoryId);
      var categoryFound = categories[categoryPosition];
      return categoryFound;
    }
    function policyDecorator(aPolicy) {
      var rPolicy = {};
      rPolicy.id = aPolicy.id;
      rPolicy.name = aPolicy.name;
      rPolicy.type = aPolicy.type;
      rPolicy.type_data = aPolicy.type_data;
      rPolicy.categories_id = aPolicy.plugin_flyvemdm_policycategories_id;
      rPolicy.description = aPolicy.comment;
      rPolicy.recommended_value = aPolicy.recommended_value;
      return rPolicy;
    }
    function categoryDecorator(aPolicy) {
      var rCategory = {};
      rCategory.id = aPolicy.plugin_flyvemdm_policycategories_id;
      rCategory.name = aPolicy.name;
      return rCategory;
    }
    function policiesDecorator(data) {
      policies = data.map(function (aPolicy) {
        return policyDecorator(aPolicy);
      });
      return policies;
    }
    function categoriesDecorator(data) {
      categories = data.map(function (aCategory) {
        return categoryDecorator(aCategory);
      });
      return policies;
    }
    // Public API here
    return {
      getPolicy: function (aPolicyId) {
        var getPolicyDefer = $q.defer();
        if (policies.length > 0) {
          getPolicyDefer.resolve(findPolicy(aPolicyId));
        } else {
          $http({
            method: 'GET',
            url: GLPI_API_URL + PluginObjectNames.Policy + '/' + aPolicyId
          }).then(function (response) {
            getPolicyDefer.resolve(policyDecorator(response.data));
          }, function () {
            getPolicyDefer.reject();
          });
        }
        return getPolicyDefer.promise;
      },
      getPolicies: function () {
        var getPoliciesDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Policy
        }).then(function (response) {
          getPoliciesDefer.resolve(policiesDecorator(response.data));
        }, function () {
          getPoliciesDefer.reject();
        });
        return getPoliciesDefer.promise;
      },
      getPolicyToDeployApp: function () {
        var getPoliciesDefer = $q.defer();
        if (policies.length > 0) {
          var policyId = findPolicyBySymbol(policies, deployApp);
          getPoliciesDefer.resolve(policyId);
        } else {
          $http({
            method: 'GET',
            url: GLPI_API_URL + PluginObjectNames.Policy
          }).then(function (response) {
            getPoliciesDefer.resolve(findPolicyBySymbol(response.data, deployApp));
          }, function () {
            getPoliciesDefer.reject();
          });
        }
        return getPoliciesDefer.promise;
      },
      getPolicyToRemoveApp: function () {
        var getPoliciesDefer = $q.defer();
        if (policies.length > 0) {
          var policyId = findPolicyBySymbol(policies, removeApp);
          getPoliciesDefer.resolve(policyId);
        } else {
          $http({
            method: 'GET',
            url: GLPI_API_URL + PluginObjectNames.Policy
          }).then(function (response) {
            getPoliciesDefer.resolve(findPolicyBySymbol(response.data, removeApp));
          }, function () {
            getPoliciesDefer.reject();
          });
        }
        return getPoliciesDefer.promise;
      },
      createPolicy: function (anInput) {
        var createPolicyDefer = $q.defer();
        $http({
          method: 'POST',
          url: GLPI_API_URL + PluginObjectNames.Policy,
          data: {
            input: anInput
          }
        }).then(function () {
          createPolicyDefer.resolve();
        }, function () {
          createPolicyDefer.reject();
        });
        return createPolicyDefer.promise;
      },
      deletePolicy: function (aPolicyId) {
        var deletePolicyDefer = $q.defer();
        $http({
          method: 'DELETE',
          url: GLPI_API_URL + PluginObjectNames.Policy + '/' + aPolicyId
        }).then(function () {
          deletePolicyDefer.resolve();
        }, function () {
          deletePolicyDefer.reject();
        });
        return deletePolicyDefer.promise;
      },
      getCategory: function (aCategoryId) {
        var getPolicyDefer = $q.defer();
        if (policies.length > 0) {
          getPolicyDefer.resolve(findCategory(aCategoryId));
        } else {
          $http({
            method: 'GET',
            url: GLPI_API_URL + PluginObjectNames.PolicyCategory + '/' + aCategoryId
          }).then(function (response) {
            getPolicyDefer.resolve(categoryDecorator(response.data));
          }, function () {
            getPolicyDefer.reject();
          });
        }
        return getPolicyDefer.promise;
      },
      getCategories: function () {
        var getPoliciesDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.PolicyCategory
        }).then(function (response) {
          getPoliciesDefer.resolve(categoriesDecorator(response.data));
        }, function () {
          getPoliciesDefer.reject();
        });
        return getPoliciesDefer.promise;
      },
      createCategory: function (anInput) {
        var createCategoryDefer = $q.defer();
        $http({
          method: 'POST',
          url: GLPI_API_URL + PluginObjectNames.PolicyCategory,
          data: {
            input: anInput
          }
        }).then(function () {
          createCategoryDefer.resolve();
        }, function () {
          createCategoryDefer.reject();
        });
        return createCategoryDefer.promise;
      },
      deleteCategory: function (aCategoryId) {
        var deleteCategoryDefer = $q.defer();
        $http({
          method: 'DELETE',
          url: GLPI_API_URL + PluginObjectNames.PolicyCategory + '/' + aCategoryId
        }).then(function () {
          deleteCategoryDefer.resolve();
        }, function () {
          deleteCategoryDefer.reject();
        });
        return deleteCategoryDefer.promise;
      }
    };
  });
