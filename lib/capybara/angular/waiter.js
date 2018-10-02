// This script is injected from waiter.rb.  It is responsible for setting
// window.capybaraAngularReady when either a) angular is ready, or b)
// it determines the page is not an angular page.

(function () {
  "use strict";

  window.capybaraAngularReady = false;

  function ready(result) {
    console.log("ANGULAR IS READY", result);
    window.capybaraAngularReady = true;
  }

  function angularPresent() {
    return window.angular !== undefined;
  }

  function element() {
    return document.querySelector("[ng-app], [data-ng-app], [data-angular-app]");
  }

  function elementPresent() {
    return element() !== undefined;
  }

  function setupTestability() {
    try {
      angular.getTestability(element()).whenStable(function(didWork) {
        ready(didWork);
      });
      ready();
    } catch (err) {
      console.log('setupTestability() catch');
      ready();
    }
  }

  function setupInjector() {
    try {
      angular.element(element()).injector().get("$browser").notifyWhenNoOutstandingRequests(ready);
    } catch (err) {
      console.log('setupInjector() catch');
      ready();
    }
  }

  function setup() {
    if (!elementPresent()) {
      console.log('!angularPresent() || !elementPresent()');
      ready();
    } else {
      angular.element(document).ready(function() {
        if (angular.getTestability) {
          console.log('setupTestability()', element(), 'angularPresent()', angularPresent());
          setupTestability();
        } else {
          console.log('setupInjector()', element(), 'angularPresent()', angularPresent());
          setupInjector();
        }
      });
    }
  }

  setup();
}());
