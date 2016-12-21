'use strict';
describe('Service: AuthProvider', function () {
  var $httpBackend, $rootScope, AuthProvider, url, PluginObjectNames, GlpiObjectNames;
  var mockCredentials = { login: 'user1@teclib.com', password: "********" };
  var mockUserId = { id: true };
  var mockSessionToken = { session_token: "39b37kafd4klb1o7bi0tjd79e2" };
  var mockResponseSessionToken = {data: mockSessionToken};
  beforeEach(module('FlyveMDM'));
  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    url = $injector.get('GLPI_API_URL');
    GlpiObjectNames = $injector.get('GlpiObjectNames');
    PluginObjectNames = $injector.get('PluginObjectNames');
    $httpBackend.when('GET', GlpiObjectNames.InitSession).respond(200, mockResponseSessionToken);
    $httpBackend.when('GET', GlpiObjectNames.KillSession).respond(200);
    $httpBackend.when('POST', PluginObjectNames.User).respond(200, mockUserId);
    $rootScope = $injector.get('$rootScope');
    AuthProvider = $injector.get('AuthProvider');
  }));
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  it('should fetch and temporaly session token and register an user', function () {
    console.log('ACCOUNT_1: Create an account on the platform with login user1@teclib.com');
    $httpBackend.expectGET(url + GlpiObjectNames.InitSession).respond(200, mockSessionToken);
    $httpBackend.expectGET('views/dashboard.html').respond(200);
    $httpBackend.expectPOST(url + PluginObjectNames.User).respond(200, mockSessionToken);
    $httpBackend.expectGET(url + GlpiObjectNames.KillSession).respond(200);
    AuthProvider.attemptRegister(mockCredentials.email, mockCredentials.password);
    $httpBackend.flush();
  });
  it('should fetch authentication token', function () {
    console.log('ACCOUNT_4: Login on the platform');
    $httpBackend.expectGET(url + GlpiObjectNames.InitSession).respond(200, mockSessionToken);
    $httpBackend.expectGET('views/dashboard.html').respond(200);
    AuthProvider.attemptLogin(mockCredentials.email, mockCredentials.password).then(function () {
      expect($rootScope.sessionToken).toBe(mockSessionToken.session_token);
    });
    $httpBackend.flush();
  });
});
