// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.defaults.withCredentials = true;

  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

.state('tab.twitter', {
    url: '/twitter',
    views: {
      'tab-twitter': {
        templateUrl: 'templates/tab-twitter.html',
        controller: 'AppCtrl'
      }
    }
  })

.state('tab.nasa', {
    url: '/nasa',
    views: {
      'tab-nasa': {
        templateUrl: 'templates/tab-nasa.html',
        controller: 'AppCtrl'
      }
    }
  });

$urlRouterProvider.otherwise('/twitter');
});

