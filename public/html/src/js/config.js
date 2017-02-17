/**
 * Created by 135946 on 2016/7/6.
 */
define([''], function (utils) {
    var getQueryStringByName = function (name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    };
    var config = {
        DEBUG: true,
        COMMENT_UTL: "http://172.28.50.173:8080",    // 微服务-评论点赞: 微服务地址
        COMMENT_APPID: 2,  // 微服务-评论点赞: appid, 当前应用在微服务注册的id标识
        COMMENT_TOKEN: "",  // 微服务-评论点赞: token, 由当前app的服务端生成, 是每个接口的必填项, 如失效, 请向服务端重新获取
        COMMENT_MAX: 20,    // 微服务-评论点赞最大评论字数，服务端最大5000，这里为了测试设定成了20
        //url: "http://localhost:3000",
        //url: "http://172.31.240.84:3000",
        //url: "http://127.0.0.1:3000",
        url: "http://172.28.50.173:8080",
        //url: "http://172.28.20.12:13300", // docker测试服务器
        COMMENT_TOKEN_URL:'/app/getCommentToken',//微服务-评论点赞token接口url
        min_token_url:"/app/gettoken",//该项目的token接口url
        min_userInfo_url:"/app/getuser",//获取用户信息接口url
        min_appid:"1",
        readerurl: "/proxy",  // TODO: proxy为代理标识, 上线时记得删除.
        namespace: "cAlum.ugc.systoon.com",
        certificate: "578f2243102ad6c444b8291d",
        limit: 10,
        key: null,
        code: null,
        openId: null,
        logintype: 0,
        loginData: { // 用户登录信息，在api.login方法中赋值
            userInfo: { userId: "" }
        },
        setTitle:true,//是否配置title
        local:window.localStorage,
        praise:{
            refreshTag:false
        }
    };
    config.namespace = getQueryStringByName("namespace");
    config.certificate = getQueryStringByName("certificate");
    config.logintype = getQueryStringByName("logintype") - 0;
    config.frame = getQueryStringByName("frame");
    config.code = getQueryStringByName("code");
    config.key = getQueryStringByName("key");
    config.openId = getQueryStringByName("toonId");
    /*
    * 判断用户信息存储时间是否大于一个小时
    * */
    config.MillisecondToDate = function (msd) {
        var date = new Date().getTime();
        var time = parseFloat(date - msd) /1000;
        if (null!= time &&""!= time) {
            if (time >60&& time <60*60) {
                time = true;
//                time = parseInt(time /60.0) +"分钟"+ parseInt((parseFloat(time /60.0) -
//                    parseInt(time /60.0)) *60) +"秒";
            }else if (time >=60*60&& time <60*60*24) {
                time = false;
                /*time = parseInt(time /3600.0) +"小时"+ parseInt((parseFloat(time /3600.0) -
                 parseInt(time /3600.0)) *60) +"分钟"+
                 parseInt((parseFloat((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60) -
                 parseInt((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60)) *60) +"秒";*/
            }else {
                time = true;
//                time = parseInt(time) +"秒";
            }
        }else{
            time = true;
//            time = "0 时 0 分0 秒";
        }
        return time;
    };

    config.loading = function (action, uri) {
        if (!config.app) {
            return;
        }
        config.app.loading(action, uri);
    };
    config.app = null;
    return config;
});
