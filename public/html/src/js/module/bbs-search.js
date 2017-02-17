/**
 * Created by 朴美言. on 2016.10.21
 */
define([
    'Vue',
    'text!tplPath/bbs-search.tpl',
    'common/utils',
    'common/api',
    'common/alertExtend',
    'core',
    'common/pageScroll',
    'common/v-comments-bar',
    'config'
],function(Vue,tpl,utils,api,alert,core,pageScroll,config){

    var search_page = {},thisModule,search_pageNum=1;
    search_page.init = function(thisModule){
        forum_id = thisModule.$route.query.typeId;//论坛ID
        thisModule.$nextTick(function(){
            thisModule.$broadcast("scrollInit");
        });
    };
    search_page.goSearch = function(){
        var that = thisModule;
        that.loadFlag = false;
        if(!that.keyWord){//判断搜索关键字是否为空
            alert("请填写搜索关键字~");
            return;
        }
        if(that.moreDataFlag == 0){//判断是否还可以加载更多
            alert("没有更多结果了~");
            return;
        }
        var params = {
            appId:utils.appID,//应用ID
            token:utils.token,//token
            keyword:that.keyWord,
            toonType:utils.toontype,
            forumIds:forum_id
        };
        utils.ajax.post('/topic/search',params,function(data){//请求搜索结果
            if(data.meta.code == 0){
                that.errorFlag = 0;
                if(search_pageNum == 1){
                    document.activeElement.blur();
                }
                if(data.data.dataList.length <= 0){
                    that.resultFlag = 0;
                }else{
                    that.resultFlag = 1;
                }

                if(data.data.dataList.length == 0){
                    that.moreDataFlag = false;
                    that.loadFlag = true;
                    return;
                }
                for(var i = 0; i < data.data.dataList.length; i++){
                    //时间转换
                    var today = new Date(),tempTime;
                    tempTime = (data.meta.timestamp - data.data.dataList[i].addtm) / 3600;
                    if(tempTime>=0 && tempTime<1){
                        data.data.dataList[i].addtm = "1小时前"
                    }else if(tempTime>1 && tempTime<24){
                        data.data.dataList[i].addtm = Math.round(tempTime) + "小时前"
                    }else if(tempTime>24){
                        data.data.dataList[i].addtm = utils.formatTime(data.data.dataList[i].addtm-0,data.meta.timestamp,'yyyy-MM-dd hh:mm').split(" ")[0];
                    }
                    //关键字标红
                    data.data.dataList[i].userInfo.name = scanKeyword(data.data.dataList[i].userInfo.name,that.keyWord);
                    data.data.dataList[i].title = scanKeyword(data.data.dataList[i].title,that.keyWord);
                    function scanKeyword(text,key){
                        var str = text;
                        var keyword = key;
                        var newText = [];
                        if(str.indexOf(keyword) == 0){
                            newText[2] = true;
                            if(str.length == keyword.length){
                                newText[0] = "";
                                newText[1] = "";
                                newText[3] = keyword;
                            }else {
                                newText[0] = "";
                                newText[1] = str.substr(str.indexOf(keyword)+keyword.length);
                                newText[3] = keyword;
                            }
                        }else if(str.indexOf(keyword) > 0){
                            newText[2] = true;
                            newText[0] = str.substr(0,str.indexOf(keyword));
                            newText[1] = str.substr(str.indexOf(keyword)+keyword.length);
                            newText[3] = keyword;
                        }else if(str.indexOf(keyword) < 0){
                            newText[2] = false;
                            newText[0] = str;
                            newText[1] = "";
                            newText[3] = keyword;
                        }
                        return newText
                    }
                }
                //that.resultList = data.data;
                if(search_pageNum === 1){
                    that.resultList = data.data;
                }else{
                    that.resultList.dataList = that.resultList.dataList.concat(data.data.dataList);
                    //that.resultList = data.data;
                }
                if(that.resultList.dataList.length <= 0){
                    that.resultFlag = 0;
                }else{
                    that.resultFlag = 1;
                }
                if(that.resultList.dataList.length > 0){
                    search_page.getSubjectList(that.resultList.dataList); /** 添加评论点赞微服务数据。 Author by Dio Zhu. on 2016.12.29 */
                }
                console.log("结果22222222222222",that.resultList);
                if(data.data.totalPage == search_pageNum){
                    that.moreDataFlag = 0
                }else{
                    search_pageNum++;
                    that.loadFlag = true;
                }
            }else{
                that.errorFlag = 1
            }
        })
    };
    /**
     * step 2. 补充微服务中的评论点赞信息
     *              -- AUthor by Dio Zhu. on 2017.1.5
     */
    search_page.getSubjectList = function(lis){
        var  _self = this,
            comments_ids = [];
        /** 添加评论点赞微服务数据。 Author by Dio Zhu. on 2016.12.29 */
            //logger.log("[comments].getAll：", lis);
        console.log("[comments].getAll：", lis);
        if (!lis) {
            // throw new Error("res is null...");
            return;
        }
        lis.forEach(function (v) { // 添加需要检索的id，后续批量获取评论用
            comments_ids.push(v.id);
        });

        api.vGetSubjectList({
            ids: "["+comments_ids.toString()+"]"
        }).then(function (rtn) {
            var result = rtn.json();
            console.log("[comments].vGetSubjectList: ", result);

            if (result.Code == 0 && result.Res && result.Res.length > 0) {
                // 数据整理，把当前数据的创建时间传入comment对象的Tm，做了sync，所以先判断再赋值
                thisModule.resultList.dataList.forEach(function (v, index) {
                    var temp;
                    //console.log("CXXXXX index = ", index, thisModule.resultList.dataList[index].comment.$set);
                    console.log("CXXXXX index = ", index);
                    if (!v.comment || (!v.comment.CommentNum && !v.comment.LikeNum)) {
                        // 匹配：微服务的SubjectId == 本地记录的id
                        //console.log("CXXXXX", v.comment.$set);

                        thisModule.$set("resultList.dataList["+index+"].comment", _.find(result.Res, function (i) { return i.SubjectId == v.id; }) || {CommentNum: 0, LikeNum: 0});

                        //v.comment = _.find(result.Res, function (i) { return i.SubjectId == v.id; }) || {CommentNum: 0, LikeNum: 0};
                        //temp = _.find(result.Res, function (i) { return i.SubjectId == v.id; }) || {CommentNum: 0, LikeNum: 0};
                        console.log("CXXXXX===>", v.comment);
                        //v.comment.CommentNum = temp.CommentNum;
                        //v.comment.LikeNum = temp.LikeNum;

                        v.comment.Tm = v.addtm; // 创建时间
                        v.comment.timeStamp = timeStamp;//系统当前时间
                        console.log("v.comment.Tm:::",v.comment.Tm)
                    }
                });
                console.log("last-thisModule.items:::",thisModule.resultList.dataList)
            }
        }, function (e) {
            console.error("[comments].vGetSubjectList: ", e);
        });
    };
    search_page.tpl = Vue.extend({
        el:function(e){
            return ".search_page";
        },
        template:tpl,
        route: {
            activate: function (transition) {
                thisModule = this;
                transition.next();
                search_page.init(thisModule);
                console.log(transition.from.name,transition.to.name)
            },
            data: function (transition){
                transition.next();
                console.log("@@@@@@@@@@@@ this.refreshTag: ", this.refreshTag);
                if (this.refreshTag) { // 重新刷新
                    this.refreshTag = false; // 重置标识
                    this.resultList = [];
                    this.keyWord = "";
                    this.$parent.$data.refreshTag = true; // 设置返回时的加载标识，回去后更新列表
                }
            }
        },
        data:function(){
            return {
                tid:utils.topicId,
                page:1,
                refreshTag: false,
                keyWord:"",
                resultList:[],
                moreDataFlag:1,
                errorFlag:0,
                resultFlag:1,
                isLoadMore:true,
                loadFlag:true,
                tempData:Object.create({"CommentFlag":true,"CommentNum":888,"LikeFlag":true,"LikeNum":1,"SubjectId":1,"Tm":"1分钟前","timeStamp":1486467569682}),
                scrollId:'page-scroll-search',
                callbackFun:function(){
                    search_page.goSearch(search_pageNum)
                },
            }
        },
        events: {

        },
        methods:{
            goSearch:function(pageNum){
                var that = thisModule;
                search_pageNum = 1
                if(!that.keyWord){//判断搜索关键字是否为空
                    alert("请填写搜索关键字~");
                    return;
                }
                var params = {
                    appId:utils.appID,//应用ID
                    keyword:that.keyWord,
                    toonType:utils.toontype,
                    token:utils.token,//token
                    forumIds:forum_id
                };
                utils.ajax.post('/topic/search',params,function(data){//请求搜索结果
                    if(data.meta.code == 0){
                        that.errorFlag = 0;
                        if(search_pageNum == 1){
                            document.activeElement.blur();
                        }
                        if(data.data.dataList.length <= 0){
                            that.resultFlag = 0;
                        }else{
                            that.resultFlag = 1;
                        }
                        for(var i = 0; i < data.data.dataList.length; i++){
                            //时间转换
                            timeStamp = data.meta.timestamp;
                            var today = new Date(),tempTime,minuteTime;
                            tempTime = (parseInt(data.meta.timestamp/1000) - data.data.dataList[i].addtm) / 3600;
                            minuteTime =(parseInt(data.meta.timestamp/1000) - data.data.dataList[i].addtm) / 60;//分钟
                            minuteTime = minuteTime<=1?1:Math.floor(minuteTime);
                            if(tempTime>=0 && tempTime<1){
                                data.data.dataList[i].addtm = minuteTime + "分钟前"
                            }else if(tempTime>1 && tempTime<24){
                                data.data.dataList[i].addtm = Math.round(tempTime) + "小时前"
                            }else if(tempTime>24) {
                                var createTime = utils.formatTime(data.data.dataList[i].addtm*1,timeStamp,'yyyy-MM-dd hh:mm');
                                data.data.dataList[i].addtm = createTime.split(" ")[0];
                            }
                            //关键字标红
                            data.data.dataList[i].userInfo.name = scanKeyword(data.data.dataList[i].userInfo.name,that.keyWord);
                            data.data.dataList[i].title = scanKeyword(data.data.dataList[i].title,that.keyWord);
                            function scanKeyword(text,key){
                                var str = text;
                                var keyword = key;
                                var newText = [];
                                if(str.indexOf(keyword) == 0){
                                    newText[2] = true;
                                    if(str.length == keyword.length){
                                        newText[0] = "";
                                        newText[1] = "";
                                        newText[3] = keyword;
                                    }else {
                                        newText[0] = "";
                                        newText[1] = str.substr(str.indexOf(keyword)+keyword.length);
                                        newText[3] = keyword;
                                    }
                                }else if(str.indexOf(keyword) > 0){
                                    newText[2] = true;
                                    newText[0] = str.substr(0,str.indexOf(keyword));
                                    newText[1] = str.substr(str.indexOf(keyword)+keyword.length);
                                    newText[3] = keyword;
                                }else if(str.indexOf(keyword) < 0){
                                    newText[2] = false;
                                    newText[0] = str;
                                    newText[1] = "";
                                    newText[3] = keyword;
                                }
                                return newText
                            }
                        }
                        that.resultList = data.data;
                        if(that.resultList.dataList.length <= 0){
                            that.resultFlag = 0;
                        }else{
                            that.resultFlag = 1;
                        }
                        if(that.resultList.dataList.length > 0 ){
                            search_page.getSubjectList(that.resultList.dataList); /** 添加评论点赞微服务数据。 Author by Dio Zhu. on 2016.12.29 */
                        }
                        console.log("结果-=------",that.resultList);
                        if(data.data.totalPage == search_pageNum){
                            that.moreDataFlag = 0
                        }else{
                            search_pageNum++
                        }
                    }else{
                        that.errorFlag = 1
                    }
                })
            },
            noNumbers:function(e){
                var keynum;
                var keychar;
                var numcheck;

                if(window.event) // IE
                {
                    keynum = e.keyCode
                }
                else if(e.which) // Netscape/Firefox/Opera
                {
                    keynum = e.which
                }
                keychar = String.fromCharCode(keynum);
                numcheck = /\d/;
                return !numcheck.test(keychar);
            },
            /**
             * 监听软键盘
             * @param e
             */

            listenBoard:  function(e){
                var keynum;
                var keychar;
                keynum = window.event ? e.keyCode : e.which;
                keychar = String.fromCharCode(keynum);
                console.log(keynum+':'+keychar);
            },
            /**
             * 清除搜索框
             */
            clearText:function(){
                var that = this;
                that.keyWord = '';
            },
            /**
             * 返回社区论坛页
             */
            goBack:function(){
                history.go(-1);
            },
            /**
             * 前往话题详情页面
             */
            goTopic:function(item, idx){
                var that = this;
                var type_color = "#E97293";
                //var tempData = {"CommentFlag":true,"CommentNum":888,"LikeFlag":true,"LikeNum":1,"SubjectId":1,"Tm":"1分钟前","timeStamp":1486467569682}
                //that.$set("tempData",tempData);
                //this.$root._currentItem = that.tempData;
                this.$root._currentItem = item;
                console.log("***********",this.$root._currentItem)
                //this.$route.router.go({name: "bbs-detail-gff", query: {id: item.id, idx: 0, type_color:type_color}});
                this.$route.router.go({name: "bbs-search-detail", query: {id: item.id, idx: 0, type_color:type_color}});
            },
        }
    });

    return search_page;
});