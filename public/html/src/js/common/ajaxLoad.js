/***
 * 公共组件alert
 * ***/
define([
    'Vue',
    'text!comTplPath/ajaxLoad.tpl'
],function(Vue,tpl){

    var ajaxLoadingComponent =new Vue({
        el:".ajax-load",
        template: tpl,
        data: {
            isShow:false,
            isShowError:false,
            isShowLoading:false
        },
        ready:function(){

        }
    });

    var ajaxFun = function(param){
        ajaxLoadingComponent.isShow = param;
    };
    /*
    var ajaxFun = {
        error:function (param) {
            ajaxLoadingComponent.isShowError = param;
        },
        loading:function (param) {
            ajaxLoadingComponent.isShowLoading = param;
        }
    };
     */

    return ajaxFun;

});