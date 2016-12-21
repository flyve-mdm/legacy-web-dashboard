'use strict';

describe('Service: UsersAdminFac', function () {

  // load the service's module
  beforeEach(module('FlyveMDM'));

  // instantiate service
  var UsersAdminFac;

  beforeEach(inject(function($injector) {
    UsersAdminFac = $injector.get('UsersAdminFac');
  }));

  it('should be injected', function () {
    expect(!!UsersAdminFac).toBeTruthy();
  });
});
