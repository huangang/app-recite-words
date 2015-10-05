angular.module('starter.controllers', [])

.controller('WordCtrl', function($scope,$state) {
    $scope.startStudy = function(){
      $state.go('tab.study');
    }

  })

  .controller('StudyCtrl', function($scope){
    $scope.studyActiveSlide = 0;
  })

.controller('MeCtrl', function($scope) {

})

.controller('MoreCtrl', function($scope) {

})

.controller('LoginCtrl', function($scope,$state){
    $scope.account = '';
    $scope.password = '';
    $scope.login = function(){
      if($scope.account != null && $scope.password != null){
        localStorage.setItem("userid", $scope.account + $scope.password);
        $state.go('tab.word');
      }
    }
    $scope.register = function(){
      $state.go('register');
    }

    $scope.forget_password = function(){
      $state.go('forget-password');
    }
})

  .controller('RegisterCtrl', function($scope,$state) {
    $scope.register = function(){
      $state.go('login');
    }
  })
  .controller('ForgetPasswordCtrl', function($scope,$state) {

  })


;
