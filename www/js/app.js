// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

  //.run(function ($ionicPlatform, $rootScope, $location, $timeout, $ionicHistory,$cordovaToast) {//app
  .run(function ($ionicPlatform, $rootScope, $location, $timeout, $ionicHistory) {//web
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

  });


    //双击退出
    $ionicPlatform.registerBackButtonAction(function (e) {
      console.log($location.path());
      //判断处于哪个页面时双击退出
      if ($location.path() == '/login' || $location.path() == '/tab/word' ||  $location.path() == '/tab/me' || $location.path() == '/tab/more' ) {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          layer.msg('再按一次退出应用');//web
          //$cordovaToast.showShortCenter('再按一次退出应用');//app
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      }
      else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $rootScope.backButtonPressedOnceToExit = true;
        layer.msg('再按一次退出应用');//web
        //$cordovaToast.showShortCenter('再按一次退出应用');//app
        setTimeout(function () {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      e.preventDefault();
      return false;
    }, 101);
  })

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })


    .state('login',{
      url:'/login',
      templateUrl: 'templates/common/login.html',
      controller: 'LoginCtrl'
    })

    .state('register',{
      url:'/register',
      templateUrl: 'templates/common/register.html',
      controller: 'RegisterCtrl'
    })

    .state('forget-password',{
      url:'/forget-password',
      templateUrl: 'templates/common/forget-password.html',
      controller: 'ForgetPasswordCtrl'
    })


    // Each tab has its own nav history stack:
    .state('tab.word', {
    url: '/word',
    views: {
      'tab-word': {
        templateUrl: 'templates/tabs/tab-word.html',
        controller: 'WordCtrl'
      }
    }
  })
    .state('tab.study', {
      url: '/study',
      views: {
        'tab-word': {
          templateUrl: 'templates/tabs/tab-study.html',
          controller: 'StudyCtrl'
        }
      }
    })

    .state('tab.me', {
      url: '/me',
      views: {
        'tab-me': {
          templateUrl: 'templates/tabs/tab-me.html',
          controller: 'MeCtrl'
        }
      }
    })
    .state('tab.more', {
    url: '/more',
    views: {
      'tab-more': {
        templateUrl: 'templates/tabs/tab-more.html',
        controller: 'MoreCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
    var  uid = localStorage.getItem("uid");
    if(uid != null && uid != ""){
      $urlRouterProvider.otherwise('/tab/word');
    }else{
      $urlRouterProvider.otherwise('/login');
    }




});
