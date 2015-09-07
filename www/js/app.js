// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngTwitter'])

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

.controller('AppCtrl', function($scope, $ionicPlatform, $twitterApi, $cordovaOauth, $http) {
  var twitterKey = 'STORAGE.TWITTER.KEY';
  var clientId = 'daLhFOdYvq0Jb4Uivdg5IL1hf';
  var clientSecret = 'N28nLRPUjih4iWhuO1zaw6RbgtcIJ9aOVKPeDHS5jIw0CRLZa7';
  var myToken = '';
  var POTDApi = 'https://api.nasa.gov/planetary/apod?api_key=OKsZatPeSQtXGUtJ9DbrB2uxeGh6NQVqFZPCZVB2';
  

  $scope.tweet = {};

  $scope.nasa = {};

  $ionicPlatform.ready(function() {
    myToken = JSON.parse(window.localStorage.getItem(twitterKey));
    if (myToken === '' || myToken === null) {
      $cordovaOauth.twitter(clientId, clientSecret).then(function (success) {
        myToken = success;
        window.localStorage.setItem(twitterKey, JSON.stringify(success));
        $twitterApi.configure(clientId, clientSecret, success);
        $scope.getPOTD();
      }, function(error) {
        console.log(error);
      });
    } else {
      $twitterApi.configure(clientId, clientSecret, myToken);
      $scope.getPOTD();
    }
  });

  $scope.showHomeTimeline = function() {
    $twitterApi.getHomeTimeline().then(function(data) {
      $scope.home_timeline = data;
    });
  };

  $scope.submitTweet = function() {
    $twitterApi.postStatusUpdate($scope.tweet.message).then(function(result) {
      $scope.showHomeTimeline();
    });
  }

  $scope.doRefresh = function() {
    $scope.showHomeTimeline();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.correctTimestring = function(string) {
    return new Date(Date.parse(string));
  };

  $scope.getPOTD = function() {
    $http.get(POTDApi).
    then(function(success) {
    // this callback will be called asynchronously
    // when the response is available
      console.log("GETPOTD");
      $scope.nasa = success;

  }, function(error) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log(error);
  });
  };
});
