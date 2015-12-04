/**
 * Created by zhg on 15/12/3.
 */
var url = "http://api.pupued.com/";
angular.module("starter.config", [])
  .constant("API", {//不会变的常量
    //API设置
    'url': url,
    'getWord': url + 'study/get_word',
    'getStudyNum': url + 'config/get_study_num',
    'userLogin' : url + 'user/login',
    'recordStudy' : url + 'study/record',
    'setStudyNum' : url + 'config/set_study_num',
  })
;
