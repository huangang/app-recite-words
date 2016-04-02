angular.module('starter.controllers', [])

  .controller('WordCtrl', function($scope,$state,$http,API,$ionicPopup,$timeout) {
    $scope.msg = function(msg){
      var time = arguments[1] ? arguments[1] : 2000;
      var popup = $ionicPopup.show({
        title: msg,
        scope: $scope
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
      $http.get(API.getUser + '?uid='+localStorage.getItem('uid'))
        .success(function(res){//成功
          if(res.result == API.success){
            var data = res.data;
            localStorage.setItem('head', data.head );
            localStorage.setItem('nickname',data.nickname);
          }
        }).error(function(data){});
    });
    $scope.startStudy = function(){
        $state.go('tab.study');
      };
    $scope.consolidate = function(){
      $state.go('tab.consolidate');
    };
    var sentence = '';
    $http.get(API.dailySentence)
      .success(function(res){//成功
        if(res.result == API.success){
          sentence = res.data.sentence;
          sentence = sentence + "<br>翻译:" + res.data.translate;
        }
      }).error(function(data){
      $scope.msg(data, 1000)
    });
    $scope.dailySentence = function(){
      //alert（警告） 对话框
      var alertPopup = $ionicPopup.alert({
        title: '每日一句',
        template: sentence,
        okText:'OK',
        cssClass :'dailySentence'
      });
    }
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

  .controller('ConsolidateCtrl', function ($scope, $sce,$http, API,getConsolidateFactory) {
    $scope.sce = $sce.trustAsResourceUrl;
    $scope.playAudio = function(){
      var audio = document.getElementById('audio');
      audio.play();
    };
    $scope.showWord = function(){
      $(".box").css({ visibility: "visible"});
    };
    getConsolidateFactory.getWord();
    //接收到刚才传过来的通知
    $scope.$on('ConsolidateWord', function() {
      $scope.wordData = getConsolidateFactory.getWordData();
      $scope.audio = $scope.wordData.audio;
    });
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
            getConsolidateFactory.getWord();
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
    };
    $scope.toStatistics = function(){
      $state.go('tab.statistics');
    };
    $scope.toSet = function(){
      if(!isWeiXin()){
        $state.go('tab.set');
      }
    };
    $scope.toVocabulary = function(){
      $state.go('tab.vocabulary');
    };
    $scope.modifyPassword = function(){
      $state.go('tab.modify');
    };
  })

  .controller('VocabularyCtrl', function($scope, getVocabulary, API, $http, $ionicPopup){
    //获取服务器数据保存
    getVocabulary.getVocabulary();
    //接收到刚才传过来的通知
    $scope.$on('Vocabulary', function() {
      $scope.vocabularyData = getVocabulary.getVocabularyData();
    });
    $scope.learn = function(vid, item){
      var url = API.delVocabulary,
        data = {
          uid: localStorage.getItem('uid'),
          vid: vid
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
            $scope.vocabularyData.splice($scope.vocabularyData.indexOf(item), 1);
          }
        });
    };


    $scope.content = '';
    $scope.data  = false;
    var length = 0;
    $scope.searchWord = function(){
      if(length < $scope.content.length){
        $http.get(API.searchWord + '?word=' + $scope.content)
          .success(function(res){//成功
            if(res.result == API.success){
              var data = res.data;
              $scope.data = data;
            }
          });
      }else {
        $scope.data = false;
      }
      length = $scope.content.length;
      if(length == 0){
        $scope.data = false;
      }
    };
    $scope.addWord = function(word, explain){
      $http.get(API.addVocabulary + '?word=' + word + '&uid=' + localStorage.getItem('uid'))
        .success(function(res){//成功
          if(res.result == API.success){
            var ret = Array();
            ret.word = word;
            ret.meaning  =explain;
            $scope.vocabularyData.add(ret);
            $scope.data = false;
          }else {
            $scope.data = false;
            var alertPopup = $ionicPopup.alert({
              title: '添加失败',
              template: '单词已经存在',
              okText:'确定',
              cssClass :'dailySentence'
            });
          }
        });
    };
  })

  .controller('SetCtrl', function($scope,$ionicActionSheet,$ionicPopup,$cordovaImagePicker,$ionicLoading,$timeout,Camera,API,$state,$http){
    $scope.head = localStorage.getItem('head');
    $scope.avatar = '';
    $scope.nickname = localStorage.getItem('nickname');
    $scope.msg = function(msg){
      var time = arguments[1] ? arguments[1] : 2000;
      var popup = $ionicPopup.show({
        title: msg,
        scope: $scope
      });
      $timeout(function() {
        popup.close(); //由于某种原因2秒后关闭弹出
      }, time);
    };
    if(isWeiXin()){//微信
      $scope.platform = 'weixin';
      $scope.selectAvatar = function(){

      };
      $scope.submit = function(nickname){

      }
    }
    else if(navigator.camera){//native
      $scope.platform = 'native';
      var fileURL = '';
      $scope.selectAvatar = function(prop){
        $ionicActionSheet.show({
          buttons: [
            { text: '拍照' },
            { text: '从相册选择' }
          ],
          titleText: '选择照片',
          cancelText: '取消',
          cancel: function() {
          },
          buttonClicked: function(index) {
            // 相册文件选择上传
            if (index == 1) {
              $scope.readAlbum(prop);
            } else if (index == 0) {
              // 拍照上传
              $scope.taskPicture(prop);
            }
            return true;
          }
        });
      };
      // 拍照
      $scope.taskPicture = function(prop) {
        if (!navigator.camera) {
          alert('请在真机环境中使用拍照上传。');
          return;
        }
        var options = {
          quality: 75,
          targetWidth: 800,
          targetHeight: 800,
          saveToPhotoAlbum: false
        };
        Camera.getPicture(options).then(function(imageURI) {
          $scope.head = imageURI;
          fileURL = imageURI;
        }, function(err) {
          alert("照相机：" + err);
        });

      };
      // 读用户相册
      $scope.readAlbum = function(prop) {
        if (!window.imagePicker) {
          alert('目前您的环境不支持相册上传。');
          return;
        }
        var options = {
          maximumImagesCount: 1,
          width: 800,
          height: 800,
          quality: 80
        };

        $cordovaImagePicker.getPictures(options).then(function(results) {
          $scope.head = results[0];
          fileURL = results[0];
        }, function(error) {
          alert(error);
        });
      };
      $scope.submit = function(nickname){
        if(fileURL != '' ){
          var options = new FileUploadOptions();
          options.fileKey = "avatar";
          options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          options.chunkedMode = true;
          var params = {
            uid:localStorage.getItem('uid'),
            nickname:nickname
          };
          options.params = params;
          var ft = new FileTransfer();
          $ionicLoading.show({
            template: '上传中...'
          });
          ft.upload($scope.head, API.updateUser,function(data) {
            var resp = JSON.parse(data.response);
            if(resp.result == API.success){
              var datas = resp.data;
              $scope.head = datas.head;
              $scope.nickname = datas.nickname;
              localStorage.setItem('head', datas.head );
              localStorage.setItem('nickname',datas.nickname);
            }
            $scope.msg('更新成功', 1000);
            $timeout(function() {
              $state.go('tab.me');
            }, 1100);

              $ionicLoading.hide();
            }, function(error) {
              $ionicLoading.hide();
            },options
          );
        }
        else {
          $ionicLoading.show({
            template: '更新中...'
          });
          $http.get(API.updateUser + '?uid='+localStorage.getItem('uid') + '&nickname=' + nickname)
            .success(function(res){//成功
              if(res.result == API.success){
                var data = res.data;
                $scope.nickname = data.nickname;
                localStorage.setItem('nickname', data.nickname);
                $scope.msg('更新成功', 1000);
                $timeout(function() {
                  $state.go('tab.me');
                }, 1100);
              }
              $ionicLoading.hide();
            }).error(function(data){
            $scope.msg(data, 1000);
            $ionicLoading.hide();
          });
        }

      }
    }
    else {//web
      $scope.platform = 'web';
      var viewFiles = document.getElementById("avatarInput");
      var viewImg = document.getElementById("set-avatar");
      function viewFile (file) {
        //通过file.size可以取得图片大小
        var reader = new FileReader();
        reader.onload = function( evt ){
          viewImg.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
      viewFiles.addEventListener("change", function () {
        //通过 this.files 取到 FileList ，这里只有一个
        viewFile(this.files[0]);
      }, false);

      //$scope.signature = '';//个性签名
      $scope.selectAvatar = function(){
        var fileInput = document.getElementById("avatarInput");//隐藏的file文本ID
        fileInput.click();//加一个触发事件
      };
      $scope.submit = function(nickname){
        $ionicLoading.show({
          template: 'Loading...'
        });
        $.ajaxFileUpload({
          fileElementId: 'avatarInput',//文件上传域的ID
          url: API.updateUser,//用于文件上传的服务器端请求地址
          dataType: 'json',
          data: { nickname: nickname, uid:localStorage.getItem('uid')},
          success: function (data, status) {//服务器成功响应处理函数
            $http.get(API.getUser + '?uid='+localStorage.getItem('uid'))
              .success(function(res){//成功
                if(res.result == API.success){
                  var data = res.data;
                  $scope.head = data.head;
                  $scope.nickname = data.nickname;
                  localStorage.setItem('head', data.head );
                  localStorage.setItem('nickname',data.nickname);
                }
                $ionicLoading.hide();
                $scope.msg('更新成功', 1000);
                $timeout(function() {
                  $state.go('tab.me');
                }, 1100);
              }).error(function(data){
              $scope.msg(data, 1000)
            });
          },
          error: function (data, status, e) {}//服务器响应失败处理函数
        });
      }
    }
  })

  .controller('TranslationCtrl', function($scope,$http,API,$ionicPopup) {
    $scope.original = '';
    $scope.submitTranslation = function(content){
      if(content.length > 200){
        //alert（警告） 对话框
        var alertPopup1 = $ionicPopup.alert({
          title: '提示',
          template: '翻译文本不能超过200个字符串',
          okText:'确认',
          cssClass :'dailySentence'
        });
        return;
      }
      if(content.length <= 0 ){
        //alert（警告） 对话框
        var alertPopup2 = $ionicPopup.alert({
          title: '提示',
          template: '请输入文本在提交',
          okText:'确认',
          cssClass :'dailySentence'
        });
        return;
      }
      $http.get(API.translation + '?content=' + content)
        .success(function(res){//成功
          if(res.result == API.success){
            var data = res.data;
            console.log(res);
            $scope.translation = data.translation[0];
          }
        }).error(function(){
      });
    }
  })

  .controller('StatisticsCtrl', function($scope,$http,API) {
    $scope.$on( "$ionicView.enter", function() {
      $scope.nickname = localStorage.getItem('nickname');
      $scope.head = localStorage.getItem('head');
      var myDate = new Date();
      $scope.time = myDate.toLocaleString( );        //获取日期与时间
      $http.get(API.statistics + '?uid=' + localStorage.getItem('uid'))
        .success(function(res){//成功
          if(res.result == API.success){
            var data = res.data;
            $scope.day = data.day;
            $scope.week = data.week;
            $scope.month = data.month;
            $scope.year = data.year;
            $scope.all = data.all;
          }
        }).error(function(data){
      });
    });
  })

  .controller('MoreCtrl', function($scope,$state) {
    $scope.toSearch = function(){
      $state.go('tab.search');
    };
    $scope.toTranslation = function(){
      $state.go('tab.translation');
    };
    $scope.toFeedback = function(){
      $state.go('tab.feedback');
    };
  })

  .controller('SearchCtrl', function($scope,$http,API) {
    $scope.content = '';
    $scope.datas  = [];
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

  .controller('FeedbackCtrl',function($scope,$http,API,$ionicPopup, $timeout,$state){
    $scope.original = '';
    $scope.submitFeedback = function(content){
      if(content.length <= 0 ){
        //alert（警告） 对话框
        var alertPopup = $ionicPopup.alert({
          title: '提示',
          template: '请输入文本在提交',
          okText:'确认',
          cssClass :'dailySentence'
        });
        return;
      }
      $http.get(API.feedback + '?content=' + content + "&uid=" + localStorage.getItem('uid'))
        .success(function(res){//成功
          if(res.result == API.success){
            var popup = $ionicPopup.show({
              title: "反馈成功",
              scope: $scope,
            });
            $timeout(function() {
              popup.close(); //由于某种原因2秒后关闭弹出
              $state.go('tab.more');
            }, 1500);
          }
        }).error(function(){
      });
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
        scope: $scope
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

  .controller('ModifyPasswordCtrl', function($scope,$state,$ionicPopup,$http, API, $timeout){
    $scope.password = '';
    $scope.modify = function(){
      if($scope.password.length < 6){
        //alert（警告） 对话框
        var alertPopup = $ionicPopup.alert({
          title: '提示',
          template: '密码长度不能小于6位',
          okText:'确认',
          cssClass :'dailySentence'
        });
        return;
      }
      var password = hex_md5($scope.password);
      $scope.msg = function(msg){
        var time = arguments[1] ? arguments[1] : 2000;
        var popup = $ionicPopup.show({
          title: msg,
          scope: $scope
        });
        $timeout(function() {
          popup.close(); //由于某种原因2秒后关闭弹出
        }, time);
      };
      var url = API.modifyPwd,
        data = {
          uid:  localStorage.getItem('uid'),
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
            $scope.msg('密码修改成功');
            $scope.password = '';
            $state.go('tab.me');
          }else {
            $scope.msg('密码修改失败');
          }
        })
    }
  })

;

//扩展
/**
 * 判断是否null
 * @param data
 */
function isNull(data){
  return (data == "" || data == undefined || data == null) ? true : data;
}

Array.prototype.add = function (item) {
  this.splice(0, 0, item);
};

/**
 * 判断是微信浏览器
 */
function isWeiXin(){
  var ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == 'micromessenger';
}
