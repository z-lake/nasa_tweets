// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngTwitter'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
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
            $cordovaOauth.twitter(clientId, clientSecret).then(function(succ) {
                myToken = succ;
                window.localStorage.setItem(twitterKey, JSON.stringify(succ));
                $twitterApi.configure(clientId, clientSecret, succ);
                $scope.getPOTD();
            }, function(error) {
                console.log(error);
            });
        } else {
            $twitterApi.configure(clientId, clientSecret, myToken);
            $scope.getPOTD();
        }
    });

    $scope.submitTweet = function() {
        $twitterApi.postStatusUpdate($scope.tweet.message + ' ' + $scope.nasa.url).then(function(result) {
            $scope.tweet = {};
        });
    }


    $scope.getPOTD = function() {
        $http.get(POTDApi).
        then(function(success) {
            $scope.nasa = success.data;
        }, function(error) {
            console.log(error);
        });
    };

    $scope.getPOTDByDate = function() {
        console.log($scope.nasa.date)
        var day = $scope.nasa.date.getDate();
        var month = $scope.nasa.date.getMonth() + 1;
        var year = $scope.nasa.date.getFullYear();
        var newDate;
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        newDate = year + '-' + month + '-' + day;
        console.log(newDate);

        // ajax request for new photo url
        $http.get(POTDApi + '&date=' + newDate)
            .then(function(success) {
                $scope.nasa = success.data;
            }, function(error) {});
    };
});