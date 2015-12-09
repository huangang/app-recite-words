angular.module('starter.controllers', [])

  .controller('WordCtrl', function($scope,$state,$http,API,$ionicPopup,$timeout) {
    $scope.msg = function(msg){
      var time = arguments[1] ? arguments[1] : 2000;
      var popup = $ionicPopup.show({
        title: msg,
        scope: $scope,
      });
      $timeout(function() {
        popup.close(); //由于某种原因2秒后关闭弹出
      }, time);
    };
    $scope.$on( "$ionicView.enter", function() {
      $scope.nowStudyNum =
        (localStorage.getItem('nowStudyNum') != null &&  localStorage.getItem('nowStudyNum') != '')
          ? localStorage.getItem('nowStudyNum') : 0;
      $http.get(API.getStudyNum + '?uid='+localStorage.getItem('uid'))
        .success(function(res){//成功
          if(res.result == API.success){
            var num = res.data;
            $scope.nowStudyNum = num.nowStudyNum;
            localStorage.setItem('nowStudyNum',num.nowStudyNum);
          }
        }).error(function(data){
        $scope.msg(data, 1000)
      });
      if(localStorage.getItem('nowStudyNum') > 0){
        $scope.studyMsg = '继续学习';
      }else {
        $scope.studyMsg = '开始学习';

      }
    });

    $scope.startStudy = function(){
        $state.go('tab.study');
      };
  })

  .controller('StudyCtrl',  function($scope,$sce,$http,getStudyWordFactory,API){
    $scope.sce = $sce.trustAsResourceUrl;
    $scope.studyActiveSlide = 0;
    $scope.audio = "";
    //获取服务器数据保存
    getStudyWordFactory.getWord();
    //接收到刚才传过来的通知
    $scope.$on('StudyWord', function() {
      $scope.wordData = getStudyWordFactory.getWordData();
      $scope.audio = $scope.wordData.audio;
      if($scope.wordData.example != '') {
        var str = $scope.wordData.example;
        var re = /(\/r\/n)/g;
        $scope.wordData.example = str.replace(re, "\n");
      }else {
        $scope.wordData.example = "无例子";
      }
    });
    $scope.playAudio = function(){
      var audio = document.getElementById('audio');
      audio.play();
    };
    $scope.nextWord = function(status){
      var url = API.recordStudy,
        data = {
          uid: localStorage.getItem('uid'),
          word: $scope.wordData.word,
          status: status
        },
        transFn = function(data) {
          return $.param(data);
        },
        postCfg = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          transformRequest: transFn
        };
      $http.post(url, data, postCfg)
        .success(function(res){//成功
          if(res.result == API.success){
            var data = res.data;
            localStorage.setItem('nowStudyNum',data.nowStudyNum);//一句学习数
            getStudyWordFactory.getWord();
          }
        });
    }
  })

  .controller('MeCtrl', function($scope,$state) {
    $scope.$on( "$ionicView.enter", function(){
      $scope.nickname = localStorage.getItem('nickname');
      $scope.head = localStorage.getItem('head');
    });
    $scope.exit = function(){
      localStorage.clear();
      $state.go('login');
    }
  })

  .controller('MoreCtrl', function($scope,$state) {
    $scope.toSearch = function(){
      $state.go('tab.search');
    }
  })

  .controller('SearchCtrl', function($scope,$http,API) {
    $scope.content = '';
    $scope.datas  = new Array();
    var length = 0;
    $scope.searchWord = function(){
      if(length < $scope.content.length){
        $http.get(API.searchWord + '?word=' + $scope.content)
          .success(function(res){//成功
            if(res.result == API.success){
              var data = res.data;
              $scope.datas.add(data);
            }
          });
      }else {
        $scope.datas = [];
      }
      length = $scope.content.length;
      if(length == 0){
        $scope.datas = [];
      }
    }
  })

  .controller('LoginCtrl', function($scope,$state,$ionicPopup,$timeout,$http,API){
    $scope.$on( "$ionicView.enter", function(){
      if(localStorage.getItem('uid') && localStorage.getItem('nickname') ){
        $state.go('tab.word');
      }
    });
    $scope.mobile = '';
    $scope.password = '';
    $scope.msg = function(msg){
      var time = arguments[1] ? arguments[1] : 2000;
      var popup = $ionicPopup.show({
        title: msg,
        scope: $scope,
      });
      $timeout(function() {
        popup.close(); //由于某种原因2秒后关闭弹出
      }, time);
    };
    $scope.login = function(){
      if($scope.mobile != '' && $scope.password != ''){
        var password = hex_md5($scope.password);
        var true_mobile = /^1[3,5,8]\d{9}$/;
        if(true_mobile.test($scope.mobile)) {
          var url = API.userLogin,
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
            .success(function(res){//成功
            if(res.result == API.success){
              var user = res.data;
              localStorage.setItem("uid", user.id );
              localStorage.setItem("openid", user.openid );
              localStorage.setItem("nickname", user.nickname );
              (user.head == '' || user.head == null) ? localStorage.setItem("head", API.defaultHead ) : localStorage.setItem("head", user.head );
              $scope.mobile = '';
              $scope.password = '';
              $state.go('tab.word');
            }else {
              $scope.msg('登录失败');
            }
          }).error(function(){//失败
            $scope.msg('登录失败');
          });
        }
        else {
          $scope.msg('手机号非法');
        }
      }else if($scope.mobile == '' && $scope.password != ''){
        $scope.msg('手机号不能为空');//web
        //$cordovaToast.showShortCenter('手机号不能为空');//app
      }else if($scope.mobile != '' && $scope.password == ''){
        $scope.msg('密码不能为空');
        //$cordovaToast.showShortCenter('密码不能为空');//app
      }else{
        $scope.msg('手机和密码不能为空', 1000);
        //$cordovaToast.showShortCenter('手机和密码不能为空');//app
      }
    };
    $scope.register = function(){
      $state.go('register');
    };
    $scope.forget_password = function(){
      $state.go('forget-password');
    };
})

  .controller('WxLoginCtrl', function($scope,$state,$location,$ionicLoading){
    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };
    $scope.hide = function(){
      $ionicLoading.hide();
    };
    $scope.show();
    var openid = $location.search()['openid'];
    var uid = $location.search()['uid'];
    var nickname = $location.search()['nickname'];
    var head = $location.search()['head'];
    if(openid != null && uid != null ){
      localStorage.setItem("openid", openid);
      localStorage.setItem("uid", uid);
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("head", head);
      (head == '') ? localStorage.setItem("head", API.defaultHead ) : localStorage.setItem("head", head );
      $scope.hide();
      $state.go('tab.word');
    }
  })

  .controller('RegisterCtrl', function($scope,$state,$http,API,$ionicPopup,$timeout) {
    $scope.nickname = '';
    $scope.mobile = '';
    $scope.password = '';
    $scope.msg = function(msg){
      var time = arguments[1] ? arguments[1] : 2000;
      var popup = $ionicPopup.show({
        title: msg,
        scope: $scope,
      });
      $timeout(function() {
        popup.close(); //由于某种原因2秒后关闭弹出
      }, time);
    };
    $scope.register = function(){
      if($scope.nickname == ''){
        $scope.msg('用户名不能为空');
        return;
      }
      if($scope.mobile == ''){
        $scope.msg('手机号不能为空');
        return;
      }else {
        var true_mobile = /^1[3,5,8]\d{9}$/;
        if(!true_mobile.test($scope.mobile)) {
          $scope.msg('手机号非法');
          return;
        }
      }
      if($scope.password == ''){
        $scope.msg('密码不能为空');
        return;
      }else {
        $scope.password = hex_md5($scope.password);
      }
      var url = API.registerUser,
        data = {
          mobile:  $scope.mobile,
          password: $scope.password,
          nickname: $scope.nickname
        },
        transFn = function(data) {
          return $.param(data);
        },
        postCfg = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          transformRequest: transFn
        };
      $http.post(url, data, postCfg)
        .success(function(res){//成功
          if(res.result == API.success){
            var user = res.data;
            localStorage.setItem("uid", user.id );
            localStorage.setItem("nickname", user.nickname );
            localStorage.setItem("head", API.defaultHead );
            $scope.mobile = '';
            $scope.password = '';
            $scope.password = '';
            $scope.msg('注册成功',1000);
            $state.go('tab.word');
          }else {
            $scope.msg(res.data.msg,1000);
          }
        }).error(function(){
        $scope.msg('注册失败',1000);
      });

    }
  })

  .controller('ForgetPasswordCtrl', function($scope,$state) {

  })

;

//扩展
/**
 * 判断是否null
 * @param data
 */
function isNull(data){
  return (data == "" || data == undefined || data == null) ? false : data;
}

Array.prototype.add = function (item) {
  this.splice(0, 0, item);
};

