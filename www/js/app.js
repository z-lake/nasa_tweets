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

  // format today's date
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd < 10) {
    dd = '0'+ dd;
  }
  if(mm < 10) {
    mm = '0' + mm;
  }
  $scope.today = mm+'-'+dd+'-'+yyyy;

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
        $scope.getPOTD();
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

  // default request to POTD api (today's date)
  $scope.getPOTD = function() {
    $http.get(POTDApi).
    then(function(success) {
      $scope.nasa = success.data;
  }, function(error) {
    console.log(error);
  });
  };

  $scope.getPOTDByDate = function() {
    var day = $scope.nasa.date.getDate();
    var month = $scope.nasa.date.getMonth() + 1;
    var year = $scope.nasa.date.getFullYear();
    var newDate;
    if(day < 10) {
      day = '0'+ day;
    }
    if(month < 10) {
      month = '0' + month;
    }
      newDate = year+'-'+month+'-'+day;
      console.log(newDate);

      // ajax request for new photo url
    $http.get(POTDApi + '&date=' + newDate)
    .then( function(success) {
      console.log('get by date');
      console.log(success.data);
      $scope.nasa = success.data;
      console.log($scope.nasa);
    }, function(error) {
      console.log(error);
    });
  };

});
