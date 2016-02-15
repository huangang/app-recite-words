angular.module('starter.services', [])

  /**
   * 获取学习单词
   */
  .factory('getStudyWordFactory',function($rootScope,$resource,API){
    var WordData = {};
    var resource = $resource(API.getWord, {}, {
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

  /**
   * 拍照功能
   */
  .factory('Camera', function($q) {
    return {
      getPicture: function(options) {
        var q = $q.defer();
        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);

        return q.promise;
      }
    }
  })


  /**
   * 获取生词本
   */
  .factory('getVocabulary',function($rootScope,$resource,API){
    var VocabularyData = {};
    var resource = $resource(API.getVocabulary, {}, {
      query: {
        method: 'get',
        params: {
          uid:'@uid',
          since_id:'@since_id',
          num:'@num'
        },
        timeout: 20000
      }
    });

    return {
      getVocabulary:function(since_id, num){
        resource.query({
          uid: localStorage.getItem('uid'),
          since_id: since_id,
          num: num
        }, function (r) {
          VocabularyData = r.data;
          localStorage.setItem('vocabularyId',VocabularyData[0].id);
          //在这里请求完成以后  通知controller
          $rootScope.$broadcast('Vocabulary');
        })
      } ,
      //返回我们保存的数据
      getVocabularyData:function(){
        return VocabularyData;
      }

    }
  })


;
