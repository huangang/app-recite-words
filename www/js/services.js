angular.module('starter.services', [])

  .factory('getStudyWordFactory',function($rootScope,$resource,G){
    var apiUrl = G.api;
    var WordData = {};
    var resource = $resource(apiUrl + 'study/get_word', {}, {
      query: {
        method: 'get',
        params: {
          uid:'@uid'
        },
        timeout: 20000
      }
    });

    return {
      getWord:function(){
        resource.query({
          uid: localStorage.getItem('uid')
        }, function (r) {
          WordData = r.data;
          //在这里请求完成以后  通知controller
          $rootScope.$broadcast('StudyWord');

        })
      } ,
      //返回我们保存的数据
      getWordData:function(){
        return WordData;
      }



    }
  })


;
