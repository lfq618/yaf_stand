/***
 * 公共函数基础库
 ***/
define([
    'Vue',
    'VueResource',
    "config",
    'common/ajaxLoad',
    'common/alertExtend'

],function(Vue,VueResource,config,ajaxLoad,alert){

    Vue.use(VueResource);


    Vue.http.interceptors.push(function(request, next){

        request.url = ""+request.url;
        if(!request.params.noLoadMask){
//            ajaxLoad(true);//保留小菊花加载提示，去掉提示框加载提示
        }
        next(function(response){
//            ajaxLoad(false);
        })
    });

    var utils = {
        version: '1.0.0'
        /**************************************************************************************************************/
    };
    //if(utils.forumId){
    //    utils.forumId = utils.forumId
    //}else{
    //    utils.forumId = "";//论坛列表页Id
    //}
    utils.localpage = "";
    utils.toontype = 102;
    utils.deleteId = ""; //删除话题id
    utils.topicDeleteFlag = 0;// 判断是否有话题删除操作
    utils.searchChangedFlag = 0; //判断搜索列表是否有更新
    utils.changedFlag = 0;//判断话题列表是否有更新
    //场景化app_id
    utils.appID = config.min_appid;
    //场景化分享用到的域名
    utils.domainName = "http://p100.portal.toon.mobi/";
    /***
     * VUE ajax请求封装
     * ***/
    utils.ajax = {
        post:function(url,parmas,callback,callbackError){
            Vue.http.options.emulateJSON = false;

            Vue.http.post(url,parmas).then(function(response){

                    console.log("~~~~~~~~~~~~~~~~~",response);
                    if(response.data.meta.code == 1001){
                        console.log("token校验失败");
                        utils.getToken(url,parmas,callback,callbackError)
                    }
                    if(callback)callback(response.data)
                },
                function(response){
                    //ajaxLoad.error(true);
                    if(callbackError){
                        callbackError();
                    }else{
                        alert("网络错误！")
                    }
                }
            );
        },
        get:function(url,parmas,callback,callbackError){

            Vue.http.get(url,{params:parmas}).then(function(response){

                    if(callback)callback(response.data)
                },
                function(response){
                    //ajaxLoad.error(true);
                    if(callbackError){
                        callbackError();
                    }else{
                        alert("网络错误！")
                    }
                }
            );
        }
    };
    /***
     * 获取querystring参数
     * ***/
    utils.getUrlParam = function(key,urlparam){
        var args = {};
        var url = '';
        if(urlparam){
            url = urlparam;
        }else{
            url = location.hash || location.search;
        }

        if(url.indexOf("?") != -1) {
            var query = url.split("?")[1];
            var pairs = query.split("&");
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf('=');
                if (pos == -1) continue;
                var argname = pairs[i].substring(0, pos);
                var value = pairs[i].substring(pos + 1);
                args[argname] = unescape(value);
            }
        }
        return args[key];
    };
    /***
     * cookie 函数封装
     * ***/
    utils.cookie = {

        set:function(obj) {
            var ck = [];
            ck.push(obj.name + '=');
            if (obj.value) {
                ck.push(!!obj.encode ? obj.value : encodeURIComponent(obj.value));
                //是否encodeURIComponent
            }
            if (obj.expires) {
                var d = new Date();
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                d.setTime(d.getTime() + obj.expires * 86400000);
                //24 * 60 * 60 * 1000
                ck.push(';expires=' + d.toGMTString());
            }
            if (obj.domain) {
                ck.push(';domain=' + obj.domain);
            }
            ck.push(';path=' + (obj.path || '/'));
            if (obj.secure) {
                ck.push(';secure');
            }
            document.cookie = ck.join('');
        },
        get:function(name, encode) {
        var m = document.cookie.match(new RegExp("(^| )" + name + "=([^;])*", "gi")),
            v = !m ? '' : m[0].split(name + '=')[1];
        return (!!encode ? v : decodeURIComponent(v));
    }

    };
    /**
     * 判断是toon还是浏览器
     * @returns {boolean}
     */
    utils.isToon = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (/toon/.test(ua)) {
            return true;
        }
        return false;
    };
    /***
     * loacalstorage 函数封装
     * ***/
    utils.localstorage = new function(){

        var storage = window.localStorage;
        var _uid = "com.systoon.secondhand";

        if (!storage) {
            alert('This browser does NOT support localStorage');
            return;
        }

        if (!storage[_uid]) {
            var obj = {

            };
            storage[_uid] = JSON.stringify(obj);
        }

        return {
            setTempData:function (key, value) {//设置某个已保存的键值
                var obj = JSON.parse(storage.getItem(_uid));
                obj[key] = value;
                storage[_uid] = JSON.stringify(obj);
            },
            getTempData:function (key) {//获取某个已保存的键值
                if (!this.has())return;
                var obj = JSON.parse(storage.getItem(_uid));
                if (obj.hasOwnProperty(key)) {
                    return obj[key];
                }
                return null;
            },
            has:function () {
                var v = storage.getItem(_uid);
                var obj = JSON.parse(v);
                if (typeof(obj) != "object" || obj == null) {
                    console.log("没有保存个人信息");
                    return false;
                }
                return true;
            },
            remove:function (key) {
                storage.removeItem(key)
            },
            clear:function(){
                storage.clear();
            }
        };
    };
    //设置标题
    utils.setTitle = function(title){
        if(!title)return;
        document.title = title;
        try{
            setTitle(title);
        }catch (e){}
    };
    utils.getCurrentPath = function (opts) {
        var rtn = document.location.hash;
        if (opts && opts.pathOnly) {
            rtn = rtn.split('?')[0].replace(/#!\//g, '');
        }
        return rtn;
    };
    /*时间转化
    * time 时间毫秒数,必传
    * format 格式,非必传 yyyy年 MM月 dd日 hh小时 mm分 ss秒，比如传入"始于yyyy-MM-dd的hh:mm",则返回"始于2014-06-15的12:05"
    *
    * */
    utils.formatTime = function(time,timeStamp,format){
        if(!time) return "";
        //过去
        var stamp = new Date(time*1000),
            year = stamp.getFullYear(),
            month = (stamp.getMonth() + 1)>9?(stamp.getMonth() + 1):"0"+(stamp.getMonth() + 1),
            day = stamp.getDate()>9?stamp.getDate():"0"+stamp.getDate(),
            hour = stamp.getHours()>9?stamp.getHours():"0"+stamp.getHours(),
            minute = stamp.getMinutes()>9?stamp.getMinutes():"0"+stamp.getMinutes(),
            sec = stamp.getSeconds()>9?stamp.getSeconds():"0"+stamp.getSeconds();
        //if(format){
            //format = format.replace("yyyy",year);
            //format = format.replace("MM",month);
            //format = format.replace("dd",day);
            //format = format.replace("hh",hour);
            //format = format.replace("mm",minute);
            //format = format.replace("ss",sec);
        //}else{

            //format = year+"-"+month+"-"+day+" "+hour+":"+minute;

            //时间转换
            var today = new Date(),tempTime,minuteTime;
            tempTime = (parseInt(timeStamp/1000) - time) / 3600;
            minuteTime =(parseInt(timeStamp/1000) - time) / 60;//分钟
            minuteTime = minuteTime<=1?1:Math.floor(minuteTime);
            if(tempTime>=0 && tempTime<1){
                format = minuteTime + "分钟前"
            }else if(tempTime>1 && tempTime<24){
                format = Math.round(tempTime) + "小时前"
            }else if(tempTime>24) {
                console.log("**************");
                if(format){
                    format = format.replace("yyyy",year);
                    format = format.replace("MM",month);
                    format = format.replace("dd",day);
                    format = format.replace("hh",hour);
                    format = format.replace("mm",minute);
                    format = format.replace("ss",sec);
                }else{
                    format = utils.formatTime(data.data.addtm*1,timeStamp,'yyyy-MM-dd hh:mm').split(" ")[0];
                    format = utils.formatTime(data.data.addtm*1,timeStamp,'yyyy-MM-dd hh:mm').split(" ")[1];
                }

                //format = utils.formatTime(data.data.addtm*1,'yyyy-MM-dd hh:mm').split(" ")[0];
                //format = utils.formatTime(data.data.addtm*1,'yyyy-MM-dd hh:mm').split(" ")[1];
            //}
        }

        return format;
    };

    /*根据思源云存储图片url获取缩略图地址
    *url图片地址，
    * w宽度，默认80
    * h高度，默认80
    * q质量，取值范围70-100，默认100
    */
    utils.getThumbnail = function (url, w, h, q) {
        if(!url) return url;
        w = w ? w : 80;
        h = h ? h : 80;
        q = q ? q : 100;
        var path = url.substr(0,url.lastIndexOf("."));
        var mimeType = url.substring(url.lastIndexOf("."),url.length);
        return path+"_"+w+"_"+h+"_"+q+"_1"+mimeType;
    };
    //场景化分享参数
    utils.commonShareObj = {
        mainUrl : "",//场景化首页URL--分享URL
        detailUrl: "",//话题详情页URL--分享URL
        shareUrl:"",//分享落地页
        toonIcon: "http://apr.qiniu.toon.mobi/FszpINSZqxKFOvCUUOTwrOqlhDrO",//toon的icon地址--分享icon
        appIcon: "",//应用icon地址--分享icon
        forumIcon:"http://apr.qiniu.toon.mobi/forumIcon.png",//论坛分享图
        address:"",//场景化地址--分享标题
        columnName: "",//版块名称--分享标题
        slogan:"",//应用宣传语--分享文字内容
        sectionTitle:"",//正文标题--分享文字内容
        downloadUrl:"http://app.toon.mobi"//统一下载页
    };

    utils.getToken = function(url,parmas,callback,callbackError){
//        if(url){
            utils.ajax.post(config.min_token_url,{appId:utils.appID},function(data){
                console.log("banner_info:::::",data)
                if(data.meta.code == 0){
                    utils.token = data.data.token;
                    console.log("app-token:",utils.token);
                    if(url){
                        parmas.token = utils.token;
                        utils.ajax.post(url,parmas,callback,callbackError);
                    }
                }else if(data.meta.code == 1001){
                    utils.getToken(url,parmas,callback,callbackError)
                }
            })
//        }
    };
    //utils.getToken();
    utils.getAppParam = function(url){
        //匹配参数
        var paramArr = url.match(new RegExp(/###\w{1,}###/g));
        if(paramArr){
            for(var i=0;i<paramArr.length;i++){
                if(!url)break;
                var temp = paramArr[i];
                if(temp === "###feedId###"){
                    var usrStr = utils.cookie.get("userInfo");
                    var userInfo = JSON.parse(usrStr);
                    var feedId = userInfo.feed_id?userInfo.feed_id:"";
                    url = url.replace("###feedId###",feedId);
                }else if(temp === "###toon_userId###"){
                    var usrStr = utils.cookie.get("userInfo");
                    var userInfo = JSON.parse(usrStr);
                    var userId = userInfo.toon_uid;
                    url = url.replace("###toon_userId###",userId);
                }else if(temp === "###objectId###"){
                    var poiStr = utils.cookie.get("poiInfo");
                    var poiInfo = JSON.parse(poiStr);
                    var obId = poiInfo.objectId;
                    if(!obId){
                        url = false;
                    }else{
                        url = url.replace("###objectId###",obId);
                    }
                }else if(temp === "###lat###"){
                    var poiStr = utils.cookie.get("poiInfo");
                    var poiInfo = JSON.parse(poiStr);
                    var lat = poiInfo.poi_lat;
                    url = url.replace("###lat###",lat);
                }else if(temp === "###long###"){
                    var poiStr = utils.cookie.get("poiInfo");
                    var poiInfo = JSON.parse(poiStr);
                    var long = poiInfo.poi_long;
                    url = url.replace("###long###",long);
                }else if(temp === "###toonId###"){
                    var poiStr = utils.cookie.get("poiInfo");
                    var poiInfo = JSON.parse(poiStr);
                    var obId = poiInfo.objectId;
                    url = url.replace("###toonId###","p_"+obId);
                }else if(temp === "###poiId###"){
                    var poiStr = utils.cookie.get("poiInfo");
                    var poiInfo = JSON.parse(poiStr);
                    var poiId = poiInfo.poi_id;
                    if(!poiId){
                        url = false;
                    }else{
                        url = url.replace("###poiId###",poiId);
                    }
                }else if(temp === "###toonType###"){
                    var toonType = utils.cookie.get("toonType");
                    url = url.replace("###toonType###",toonType);
                }
            }
        }
        return url;
    };

    return utils;
});