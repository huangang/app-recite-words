angular.module('starter.controllers', [])

  .controller('WordCtrl', function($scope,$state,$http,API) {
    $scope.studyNum = 50;
    $http.get(API.getStudyNum + '?uid='+localStorage.getItem('uid'))
      .success(function(res){//成功
      if(res.result == 1){
        var num = res.data;
        $scope.studyNum = num.studyNum;
        localStorage.setItem('studyNum',num.studyNum);
      }
    }).error(function(data){
      layer.msg(data)
    });
      $scope.startStudy = function(){
        $state.go('tab.study');
      };
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
          var url = G.api + 'config/set_study_num',
            data = {
              uid:  localStorage.getItem('uid'),
              num: num
            },
            transFn = function(data) {
              return $.param(data);
            },
            postCfg = {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
              transformRequest: transFn
            };
          $http.post(url, data, postCfg)
            .success(function(data){
              $scope.studyNum = num;
            layer.msg('设置成功');
          }).error(function(){//失败
            layer.msg('设置失败');
          });
        }

      });
    }
  })

  .controller('StudyCtrl',  function($scope,$sce,$http,getStudyWordFactory,API){
    $scope.sce = $sce.trustAsResourceUrl;
    $scope.studyActiveSlide = 0;
    $scope.audio = "http://media.shanbay.com/audio/us/hello.mp3";
    //获取服务器数据保存
    getStudyWordFactory.getWord();
    //接收到刚才传过来的通知
    $scope.$on('StudyWord', function() {
      $scope.wordData = getStudyWordFactory.getWordData();
      $scope.audio = $scope.wordData.audio;
      if($scope.wordData.example != ''){
        var str = $scope.wordData.example;
        var re = /(\/r\/n)/g;
        $scope.wordData.example = str.replace(re,"\n");
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
          if(res.result == 1){
            var data = res.data;
            localStorage.setItem('residueStudy',data.residue);//剩余学习数
            getStudyWordFactory.getWord();
          }
        });

    }
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

  .controller('LoginCtrl', function($scope,$state,$http,API){//web//.controller('LoginCtrl', function($scope,$state,$cordovaToast){//app
    $scope.mobile = '';
    $scope.password = '';
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
              if(res.result == 1){
                var user = res.data;
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
      };
    $scope.register = function(){
      $state.go('register');
    };
    $scope.forget_password = function(){
      $state.go('forget-password');
    };
})

  .controller('WxLoginCtrl', function($scope,$state,$location){
    layer.load();
    var openid = $location.search()['openid'];
    var uid = $location.search()['uid'];
    var nickname = $location.search()['nickname'];
    var head = $location.search()['head'];
    if(openid != null && uid != null ){
      localStorage.setItem("openid", openid);
      localStorage.setItem("uid", uid);
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("head", head);
      layer.closeAll('loading');
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
