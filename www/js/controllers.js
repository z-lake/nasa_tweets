angular.module('starter.controllers', ['ngCordova', 'ngTwitter'])

.controller('AppCtrl', function($scope, $location, $ionicPlatform, $twitterApi, $cordovaOauth) {
  var twitterKey = 'STORAGE.TWITTER.KEY';
  var clientId = 'sJmDHSoYlRuoCT40f3lCdJj5c';
  var clientSecret = 'rwxxczkdE5rKWBGJUQTaf75qjeHvoMM4TRWMGCL8zTFpvzZ4hP';
  var myToken = '';

  $scope.tweet = {};

  $ionicPlatform.ready(function() {
    myToken = JSON.parse(window.localStorage.getItem(twitterKey));
    if (myToken === '' || myToken === null) {
      $cordovaOauth.twitter(clientId, clientSecret).then(function (success) {
        myToken = success;
        window.localStorage.setItem(twitterKey, JSON.stringify(success));
        $twitterApi.configure(clientId, clientSecret, success);
        $location.path('/twitter');
        $scope.showHomeTimeline();
      }, function(error) {
        console.log(error);
      });
    } else {
      $twitterApi.configure(clientId, clientSecret, myToken);
      $scope.showHomeTimeline();
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
});
