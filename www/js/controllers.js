angular.module('starter.controllers', [])
  .constant("G", {
    //全局变量设置
    'api': 'http://api.pupued.com',
    'version':'1.0.0'
  })

.controller('WordCtrl', function($scope,$state,$http) {
    $scope.startStudy = function(){
      $state.go('tab.study');
    }
  layer.use('extend/layer.ext.js', function(){
    layer.ext = function(){
      layer.prompt({})
    };
  });
  $scope.adjustPlan = function(){
    layer.prompt({
      title: '请输入新的学习计划',
      formType: 0 //prompt风格，支持0-2
    }, function(pass){
      $http.post('api/user', postData, config
      ).success(function(data, status, headers, config) {
        //成功之后做一些事情
      }).error(function(data, status, headers, config) {
        //处理错误
      });
    });
  }
})

  .controller('StudyCtrl', function($scope){
    $scope.studyActiveSlide = 0;
  })

.controller('MeCtrl', function($scope,$state) {
  $scope.nickname = localStorage.getItem('nickname');
  $scope.head = localStorage.getItem('head');
  $scope.exit = function(){
    localStorage.clear();
    $state.go('login');
  }
})

.controller('MoreCtrl', function($scope) {

})

.controller('LoginCtrl', function($scope,$state){//web
//.controller('LoginCtrl', function($scope,$state,$cordovaToast){//app

  $scope.mobile = '';
  $scope.password = '';
  $scope.login = function(){
      console.log($scope.mobile);
      if($scope.mobile != '' && $scope.password != ''){
        localStorage.setItem("uid", $scope.mobile + $scope.password);
        var true_mobile = /^1[3,5,8]\d{9}$/;
        if(true_mobile.test($scope.mobile)) {
          $scope.mobile = '';
          $scope.password = '';
          $state.go('tab.word');
        }
        else {
          layer.msg('手机号非法');
        }
      }else if($scope.mobile == '' && $scope.password != ''){
        layer.msg('手机号不能为空');//web
        //$cordovaToast.showShortCenter('手机号不能为空');//app
      }else if($scope.mobile != '' && $scope.password == ''){
        layer.msg('密码不能为空');
        //$cordovaToast.showShortCenter('密码不能为空');//app
      }else{
        layer.msg('手机和密码不能为空');
        //$cordovaToast.showShortCenter('手机和密码不能为空');//app
      }
    }
  $scope.register = function(){
    $state.go('register');
  }

    $scope.forget_password = function(){
      $state.go('forget-password');
    }
})

  .controller('WxLoginCtrl', function($scope,$state,$location){
    var openid = $location.search()['openid'];
    var uid = $location.search()['uid'];
    var nickname = $location.search()['nickname'];
    var head = $location.search()['head'];
    if(openid != null && uid != null ){
      localStorage.setItem("openid", openid);
      localStorage.setItem("uid", uid);
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("head", head);
      $state.go('tab.word');
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
