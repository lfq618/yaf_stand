define([
    'Vue',
    'text!tplPath/bbs_list.tpl',
    'common/utils',
    'config',
    'common/api',
    'common/alertExtend',
    'common/pageScroll',
    'core',
    'common/scrollTop',
    'common/v-comments-bar',
    'common/logger'
],function(Vue,tpl,utils,config,api,alert,pageScroll,core,scrollTop,logger){

    var forum = {},thisModule,feedId,type_id,toPage,changedFlag,forum_id,forum_name,timeStamp;
    forum.init = function(backInit){
        api.vGetToken();
        forum_id = thisModule.$route.query.typeId;
        forum_name = thisModule.$route.query.typeName;
        //document.title = forum_name;
        console.log("刷新论坛列表页");
        console.log("?????????");
        thisModule.$emit('getBanner');
        if(config.setTitle == true){
            thisModule.$emit('setTitle');
        }
        thisModule.$nextTick(function(){
            thisModule.$broadcast("scrollInit");
        });
        forum.getData(true,true);
    };
    forum.getData = function(newData,backInit){
        thisModule.loadFlag = false;
        var params = {};
        params.appId = utils.appID;//应用ID
        //params.token = config.COMMENT_TOKEN;//token
        params.token = utils.token ? utils.token : " ";//token
        params.forumIds = forum_id;//论坛ID
        params.page = 1;//当前页
        params.pageLimit = 10;//每页显示数
        params.toonType = utils.toontype;

        utils.ajax.post('/topic/list',params,function(e){
            console.log(e);
            if(e.meta.code == 0){
                timeStamp = e.meta.timestamp;
                thisModule.errorFlag = 0;
                if(params.page == 1){
                    thisModule.items = e.data.dataList
                }else{
                    thisModule.items = thisModule.items.concat(e.data.dataList);
                }
                thisModule.isShowK = false;
                if(e.data.dataList.length==0){
                    thisModule.isLoadMore = false;
                    thisModule.loadFlag = true;
                    thisModule.showFlag = true;
                    return;
                }
                for(var i=0;i<thisModule.items.length;i++){
                    thisModule.items[i].userInfo.avatar = utils.getThumbnail(thisModule.items[i].userInfo.avatar);
                }
                forum.getSubjectList(e.data.dataList); /** 添加评论点赞微服务数据。 Author by Dio Zhu. on 2016.12.29 */
                if(thisModule.page == e.data.totalPage){
                    thisModule.isGoTop = false;
                    thisModule.isLoadMore = false;
                }
                thisModule.page++;
                thisModule.loadFlag = true;
                thisModule.$nextTick(function(){
                    thisModule.showFlag = true;
                });
            }else{
                thisModule.errorFlag = 1;
                thisModule.isLoadMore = false;
                alert('获取数据失败');
            }
            thisModule.isShowK = true;
        })
    };
    /**
     * step 2. 补充微服务中的评论点赞信息
     *              -- AUthor by Dio Zhu. on 2017.1.5
     */
    forum.getSubjectList = function(lis){
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
        var vGetSubjectList = function(){
            api.vGetSubjectList({
                ids: "["+comments_ids.toString()+"]"
            }).then(function (rtn) {
                var result = rtn.json();
                console.log("[comments].vGetSubjectList: ", result);

                if (result.Code == 0 && result.Res && result.Res.length > 0) {
                    // 数据整理，把当前数据的创建时间传入comment对象的Tm，做了sync，所以先判断再赋值
                    thisModule.items.forEach(function (v) {
                        if (!v.comment || (!v.comment.CommentNum && !v.comment.LikeNum)) {
                            // 匹配：微服务的SubjectId == 本地记录的id
                            v.comment = _.find(result.Res, function (i) { return i.SubjectId == v.id; }) || {CommentNum: 0, LikeNum: 0};
                            v.comment.Tm = v.addtm; // 创建时间
                            v.comment.timeStamp = timeStamp;//系统当前时间
                            console.log("v.comment.Tm:::",v.comment.Tm)
                        }
                    });
                    console.log("last-thisModule.items:::",thisModule.items)
                }else if(result.Code == 1002){
                    var regetToken = function(){
                        api.vGetToken().then(function (token) {
                            console.log("token",token);
                            if(token){
                                config.COMMENT_TOKEN = token;
                                console.log("获取到了");
                                vGetSubjectList();
                            }else{
                                regetToken();
                            }
                        });
                    }
                    regetToken();
                }
            }, function (e) {
                console.error("[comments].vGetSubjectList: ", e);
            });
        };
        vGetSubjectList();
        //api.vGetSubjectList({
        //    ids: "["+comments_ids.toString()+"]"
        //}).then(function (rtn) {
        //    var result = rtn.json();
        //    console.log("[comments].vGetSubjectList: ", result);
        //
        //    if (result.Code == 0 && result.Res && result.Res.length > 0) {
        //        // 数据整理，把当前数据的创建时间传入comment对象的Tm，做了sync，所以先判断再赋值
        //        thisModule.items.forEach(function (v) {
        //            if (!v.comment || (!v.comment.CommentNum && !v.comment.LikeNum)) {
        //                // 匹配：微服务的SubjectId == 本地记录的id
        //                v.comment = _.find(result.Res, function (i) { return i.SubjectId == v.id; }) || {CommentNum: 0, LikeNum: 0};
        //                v.comment.Tm = v.addtm; // 创建时间
        //                v.comment.timeStamp = timeStamp;//系统当前时间
        //                console.log("v.comment.Tm:::",v.comment.Tm)
        //            }
        //        });
        //        console.log("last-thisModule.items:::",thisModule.items)
        //    }
        //    else if(result.Code == 1002){
        //        var regetToken = function(){
        //            api.vGetToken().then(function (token) {
        //                console.log("token",token);
        //                if(token){
        //                    config.COMMENT_TOKEN = token;
        //                    console.log("获取到了")
        //                }else{
        //                    regetToken();
        //                }
        //            });
        //        }
        //        regetToken();
        //    }
        //}, function (e) {
        //    console.error("[comments].vGetSubjectList: ", e);
        //});
    };
    forum.tpl = Vue.extend({
        el:function(){
            return "#bbs-list"
        },
        template:tpl,
        route: {
            activate: function (transition) {
                thisModule = this;//保存当前激活组件模型
                this.id = 1;
                transition.next();
                forum.init();
            },
            data: function (transition){
                console.log(transition.from.name,transition.to.name)
                transition.next();
                console.log("@@@@@@@@@@@@ this.refreshTag: ", this.refreshTag);
                if(transition.to.name != "bbs-list"){
                    return
                }
                if (this.refreshTag || config.praise.refreshTag) { // 重新刷新
                    this.refreshTag = false; // 重置标识
                    config.praise.refreshTag = false;// 重置标识
                    // 重置数据
                    this.isLoadMore = true;
                    this.loadFlag = false;
                    this.commentList = [];
                    // 刷新列表
                    forum.getData(true,true);
                }
            }
        },
        data:function(){
            var name = function(query){
                var obj;
                try{
                    if(!!query){
                        if(!!query.typeName){
                            return query.typeName;
                        }
                        if(!!query.params){
                            obj = JSON.parse(query.params);
                            if(obj.typeName){
                                return obj.typeName;
                            }
                        }
                    }
                }
                catch(e){
                    console.error(e);
                    return utils.getUrlParam('typeName');
                }
                return utils.getUrlParam('typeName');
            }(this.$route.query);
            if(!name){
                console.log(this.$route);
            }
            this_rout_name = this.$route.typeName
            return{
                page:1,
                name: name,
                bannerImage:[],
                refreshTag:false,
                isGoTop:true,
                isLoadMore:true,
                loadFlag:true,
                items:[],
                avatar:'',
                feedId:'',
                isShowK:false,
                showModule:0,
                talentsList:[],
                scrollId:'page-scroll-forum',
                showFlag:false,
                callbackFun:function(){
                    forum.getData(false)
                },
                errorFlag:0
            }
        },
        //ready:function(){
        //},
        events: {
            setTitle:function(){
                var that = this;
                var name = this_rout_name;
                //if(name === "search" || name === "topic_page" || name === "rout_topic_page" || name === "search_topic_page" || name === "search_topic_detail" || name === "expert_detail"){
                //    return;
                //}
                document.title = that.name;
                try{
                    setTitle(that.name);
                }catch (e){}
                window.localStorage.setItem("forumName",that.name);
                console.log("forum_title3",utils.forum_title)
            },
            getBanner:function(){
                var that = this;
                var params = {};
                params.appId = utils.appID;//应用ID
                params.token = utils.token ? utils.token : " ";//token
//                params.appId = 408;
                params.toonType = utils.toontype;
                params.id = forum_id;
//                params.token = "54645646";
                utils.ajax.post('/forum/banner',params,function(data){
                    console.log("banner_info:::::",data)
                    if(data.meta.code == 0){
                        //window.localStorage.setItem("forumId","");
                        that.errorFlag = 0;
                        that.bannerImage = data.data.dataList;
                        console.log("背景图-------------",data.data.dataList);
                        /**
                         * 初始化banner的swiper
                         */
                        setTimeout(function(){
                            var MyBgswiper = new Swiper('.bannerContainer',{
                                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                                observeParents: true,//修改swiper的父元素时，自动初始化swiper
                                loop:false,
                                autoplay:3000,
                                autoplayDisableOnInteraction : false,
                                pagination:".swiper-pagination-bannerContainer"
                            });
                        },100);
                    }else {
                        that.errorFlag = 1
                    }
                })
            }
        },
        methods:{
            /**
             * 前往banner
             * @param src
             */
            goBannerDetail:function(src){
                if(src){
                    var url = src;
                    url = utils.getAppParam(url);
                    location.href = url;
                }
            },
            /**
             * 前往搜索页面
             */
            goToSearch:function(){
                var that = this;
                this.$route.router.go({name:'bbs-search',query: {typeId: forum_id}});
            },
            /**
             * 前往话题详情页面
             */
            goTopic:function(item, idx){
                var that = this;
                var type_color = "#E97293";
                this.$root._currentItem = item;
                this.$route.router.go({name: "bbs-detail", query: {id: item.id, idx: 0, type_color:type_color}});
            },
            /**
             * 前往发布页面
             */
            fabu:function(){
                var that = this;
                var params = {
                    id:this.id,
                    name:this.name
                };
                console.log(params);
//                that.feedId = "c_306511";
                that.feedId = config.loginData.userInfo.feedId;
                if(!that.feedId){
                    toonCall({'type':'1'},"card/chooseCard",function(e){
                        console.log("获取名片信息：：：：",e);
                        that.feedId = e.feedId;
                        if(e && e.feedId){
                            utils.ajax.get('/user/feed',{feedId:e.feedId},function(data){
                                if(data.code == 0){
                                    console.log('已选择名片');
                                    that.errorFlag = 0;
                                    that.$route.router.go({name:'bbs-release',query:{params:JSON.stringify(params)}});
                                }else{
                                    that.errorFlag = 1;
                                    console.log('cookie没feedId');
                                }
                            })
                        }
                    },function(){
                        console.log("未返回信息")
                    })
                }
                else{
                    that.$route.router.go({name:'bbs-release',query:{params:JSON.stringify(params)}});
                }
            },
            /**
             * 前往发布页面（论坛无话题时）
             */
            goRelease:function(){
                var that = this;
                that.feedId = "c_306511";
                var params = {
                    id:that.id,
                    name:that.name
                };
                console.log(params);
                if(!that.feedId){
                    toonCall({'type':'1'},"card/chooseCard",function(e){
                        console.log("选择名片后的返回数据：：：：：",e);
                        that.feedId = e.feedId;
                        if(e && e.feedId){
                            utils.ajax.get('/user/feed',{feedId:e.feedId},function(data){
                                if(data.code == 0){
                                    console.log('已选择名片')
                                    //toPage = "release";
                                    that.errorFlag = 0;
                                    that.$route.router.go({name:'bbs-release',query:{params:JSON.stringify(params)}});
                                }else{
                                    that.errorFlag = 1;
                                    console.log('cookie没feedId');
                                }
                            })
                        }
                    },function(){
                        console.log("未返回信息")
                    });
                }
                else{
                    this.$route.router.go({name:'bbs-release',query:{params:JSON.stringify(params)}});
                }
            }
        }
    });

    return forum;
});



