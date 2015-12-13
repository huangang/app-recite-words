/**
 * Created by zhg on 15/12/3.
 */
var url = "http://api.pupued.com/";
angular.module("starter.config", [])
  .constant("API", {//不会变的常量
    //API设置
    'url'          : url,
    'success'      : 1,
    'getWord'      : url + 'study/get_word',//获取单词
    'getStudyNum'  : url + 'study/get_study_num',//获取今天已经学习的数量
    'userLogin'    : url + 'user/login',//登录
    'recordStudy'  : url + 'study/record',//记录
    'defaultHead'  : 'http://statics.pupued.com/img/default-head.png',//默认头像
    'registerUser' : url + 'user/register',//注册
    'searchWord'   : url + 'study/search_word',//搜索单词
    'dailySentence': url + 'study/daily_sentence',//每日一句
    'translation'  : url + 'study/translation',//翻译
    'statistics'   : url + 'study/statistics',//学习统计
  })
;
