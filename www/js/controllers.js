angular.module('starter.controllers', [])

.controller('WordCtrl', function($scope,$state,$http,G) {
  $http.get(G.api + 'config/get_study_num?uid='+localStorage.getItem('uid'), {
  }).success(function(data){//成功
    if(data.result == 1){
      $scope.studyNum = data.data.study_num;
    }else {
      $scope.studyNum = 50;
    }
  }).error(function(){//失败

  });

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
    }, function(num){
      num = + num;
      if(isNaN(num) ){
        layer.msg('只能填写数字类型', {
          time: 20000, //20s后自动关闭
          btn: ['明白了', '知道了']
        });
      }else {
        $http.post(G.api + 'config/set_study_num', {
          uid: localStorage.getItem('uid'),
          num: num
        }).success(function(){//成功
          layer.msg('设置成功');
        }).error(function(){//失败
          layer.msg('设置失败');
        });
      }

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

.controller('LoginCtrl', function($scope,$state,$http,G){//web
//.controller('LoginCtrl', function($scope,$state,$cordovaToast){//app

  $scope.mobile = '';
  $scope.password = '';
  $scope.login = function(){
      if($scope.mobile != '' && $scope.password != ''){
        var password = hex_md5($scope.password);
        var true_mobile = /^1[3,5,8]\d{9}$/;
        if(true_mobile.test($scope.mobile)) {
          var url = G.api + 'user/login',
            data = {
              mobile:  $scope.mobile,
              password: password
            },
            transFn = function(data) {
              return $.param(data);
            },
            postCfg = {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
              transformRequest: transFn
            };
          $http.post(url, data, postCfg)
            .success(function(data){//成功
            if(data.result == 1){
              var user = data.data;
              localStorage.setItem("uid", user.id );
              localStorage.setItem("openid", user.openid );
              localStorage.setItem("nickname", user.nickname );
              localStorage.setItem("head", user.head );
              $scope.mobile = '';
              $scope.password = '';
              $state.go('tab.word');
            }else {
              layer.msg('登录失败');
            }
          }).error(function(data){//失败
            layer.msg('登录失败');
          });

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
