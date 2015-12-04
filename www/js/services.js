angular.module('starter.services', [])

  .factory('getConfig', function($rootScope,$resource,G) {
    var apiUrl = G.api;
    var configData = {};
    var resource = $resource(apiUrl + 'config/get_study_num', {}, {
      query: {
        method: 'get',
        params: {
          uid:'@uid'
        },
        timeout: 20000
      }
    });

    return {
      getDayNum:function(){
        resource.query({
          uid: localStorage.getItem('uid')
        }, function (r) {
          configData = r.data;
          //在这里请求完成以后  通知controller
          $rootScope.$broadcast('PortalConfig');

        })
      } ,
      //返回我们保存的数据
      getConfigData:function(){
        return configData.studyNum;
      }




    }
  })
  .factory('getUser',function(){

  });
