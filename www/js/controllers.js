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

});
