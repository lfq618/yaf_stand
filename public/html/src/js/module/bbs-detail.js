define([
    'Vue',
    'text!tplPath/bbs_detail.tpl',
    'config',
    'common/api',
    'common/utils',
    'core',
    'common/alertExtend',
    'common/scrollTop',
    'common/v-comments-bar'
],function(Vue,tpl,config,api,utils,bannerImage,alert,scrollTop){

    var topicPage = {},thisModule,Id,feedId,useId,page = 1,routername,feedname,timeStamp;
    topicPage.init = function(thisModule){
        Id = thisModule.$route.query.id;//话题id
    };
    topicPage.tpl = Vue.extend({
        template:tpl,
        route: {
            activate: function (transition) {
                thisModule = this;
                transition.next();
                topicPage.init(this);
                this.$emit("init");

                console.log(transition.from.name,transition.to.name)
                utils.localpage = transition.to.name;
            },
            data: function (transition) {
                transition.next();

                console.log("@@@@@@@@@@@@ this.refreshTag: ", this.refreshTag);
                if (this.refreshTag) { // 重新刷新
                    this.refreshTag = false; // 重置标识
                    this.$parent.$data.refreshTag = true; // 设置返回时的加载标识，回去后更新列表
                    //console.log("this.currentItem-------",this.currentItem,this.$root._currentItem);
                    // 重置数据
                    this.limit = config.limit;
                    this.offset = 0;
                    this.dataExist = 1;
                    this.isLoadMore = true;
                    this.loadFlag = false;
                    this.commentList = [];

                    // 更新评论数字
                    //this.$set("._currentItem.comment.CommentNum",this.currentItem.comment.CommentNum += 1);
                    console.log("this.currentItem-------11",this.currentItem.comment.CommentNum);
                    this.currentItem.comment.CommentNum += 1;
                    //this.$set('currentItem.comment.CommentNum', 1);
                    //this.$set('currentItem', JSON.parse(JSON.stringify(this.currentItem)));
                    console.log("this.currentItem-------22",this.currentItem.comment.CommentNum);

                    // 刷新列表
                    this.getList();
                }
            },
        },
        data:function(){
            var _self = this;
            return {
                //detatilUrl:"",
                detailData:[],
                commentList:[],
                offset: 0,          // 当前页数
                limit: config.limit,// 每页显示记录数
                isEmpty:true,
                //subjectId: Id || 0,             // 业务表详情id
                subjectId: _self.$route.query.id || 0,             // 业务表详情id
                currentItem: null,  // 业务表对象，用于详情显示
                islinkActive:false,
                isDeleat:false,
                iszambia:0,
                iszambiaList:0,
                typeName:"",
                refreshTag: false,
                current_lab: 0,
                isActive:0,
                praiseNum:0,
                init_index:0,
                scrollId:"page-scroll-topic",
                topicList:[],
                isLoadMore:true,
                type_color:this.$route.query.type_color,
                loadFlag:false,
                from_page:null,
                callbackFun:function(){
                    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
                    //thisModule.$emit("getComments",false);
                    _self.getComments(false)
                    //expert_list.getData(false)
                },
                errorFlag:0
            }
        },
        ready:function(){
            this.currentItem = this.$root._currentItem || null;
            console.log("CXXXXXX", this._uid);
        },
        events: {
            init: function () {
                this.getDetail();
                //this.getComments();
            }
        },
        methods:{
            goToviewImage:function(index){
                this.init_index = index;
                this.$route.router.go({path:"viewImage",append:true});
            },
            reGetToken:function(func){
                var that = this;
                utils.ajax.post('/app/gettoken',{appId:utils.appID},function(data){
                    if(data.meta.code == 0){
                        utils.token = data.data.token;
                        func;
                    }else if(data.meta.code == 1001){
                        that.reGetToken()
                    }
                })
            },
            getList: function () {
                // logger.log("[scroller].callback: ", this.current_lab);
                if (this.current_lab == 0) {
                    this.getDetail();
//                    this.getComments();
                } else {
                    this.getPraise();
                }
            },

            getDetail:function(loadFlag){//详情接口
                var that = this;
                uid = utils.cookie.get("uid")*1;
                var noLoadMask = false;
                if(loadFlag){
                    noLoadMask = true
                }else {
                    noLoadMask = false
                }
                var params = {};
                params.appId = utils.appID;
                params.token = utils.token;
                //params.id = 4;
                params.id = Id;

                utils.ajax.post('/topic/detail',params,function(data){
                    console.log(data);
                    if(data.meta.msg == "话题不存在"){
                        that.isEmpty = false;
                        return;
                    }
                    if(data.meta.code == 0){
                        //时间转换
                        timeStamp = data.meta.timestamp;
                        var today = new Date(),tempTime,minuteTime;
                        tempTime = (parseInt(data.meta.timestamp/1000) - data.data.addtm) / 3600;
                        minuteTime =(parseInt(data.meta.timestamp/1000) - data.data.addtm) / 60;//分钟
                        minuteTime = minuteTime<=1?1:Math.floor(minuteTime);
                        if(tempTime>=0 && tempTime<1){
                            data.data.addtm = minuteTime + "分钟前"
                        }else if(tempTime>1 && tempTime<24){
                            data.data.addtm = Math.round(tempTime) + "小时前"
                        }else if(tempTime>24) {
                            var createTime = utils.formatTime(data.data.addtm*1,timeStamp,'yyyy-MM-dd hh:mm');
                            data.data.addtm = createTime.split(" ")[0];
                            data.data.time = createTime.split(" ")[1];
                            //data.data.addtm = utils.formatTime(data.data.addtm*1,'yyyy-MM-dd hh:mm').split(" ")[0];
                            //data.data.time = utils.formatTime(data.data.addtm*1,'yyyy-MM-dd hh:mm').split(" ")[1];
                        }
                        useId = data.data.userInfo.userId;
                        //that.typeName = data.data.type_name;
                        //if(useId == uid) {
                        if(useId == config.loginData.userInfo.userId) {
                            that.isDeleat = true;
                        }
                        that.topicList = data.data.pics;
                        that.iszambia = data.data.is_praise;
                        that.praiseNum = data.data.praise_num;
                        data.data.userInfo.avatar = utils.getThumbnail(data.data.userInfo.avatar);
                        console.log(that.praiseNum);
                        that.detailData = data.data;
                    }else if(data.meta.code == 1){
                        that.isEmpty = false;
                    }
                    that.$nextTick(function () {
                        that.getComments();
                    });
                })
            },
            /**
             * step 1. 从微服务获取评论列表
             *              -- Author by Dio Zhu. on 2016.12.28
             */
            getComments: function () {
                var _self = this,
                    params = {},
                    key;
                console.log("[comments].getComments: ");
                _self.loadFlag = false;

                params.subjectId = _self.subjectId;
                params.offset = _self.offset;
                //params.offset = 0;
                params.limit = _self.offset + _self.limit;
                //params.limit = 10;
                var vGetCommentsList = function(){
                    api.vGetCommentsList(params, {loading: true}).then(function (res) {
                        var result = res.json();
                        console.log('GET Comments SUCCESS: ', result);
                        if(result.Code == 1002){
                            var regetToken = function(){
                                api.vGetToken().then(function (token) {
                                    console.log("token",token);
                                    if(token){
                                        config.COMMENT_TOKEN = token;
                                        console.log("获取到了");
                                        vGetCommentsList();
                                    }else{
                                        regetToken();
                                    }
                                });
                            }
                        }else if (result.Code == 0 && result.Res && result.Res.length > 0) {
                            var len = result.Res.length;
                            if (len > 0) {
                                _self.offset += len;
                                _self.dataExist = 1;

                                /** 只返回数据, 根据请求数和返回数判断是否没数据了 */
                                if (len < _self.limit) {
                                    _self.isLoadMore = false;
                                }

                                //_self.$set("listData", _self.listData.concat(result.Res));
                                result.Res.forEach(function (v) {
                                    v.timeStamp = timeStamp;//系统当前时间
                                });
                                _self.$set("commentList", _self.commentList.concat(result.Res));
                                console.log("commentList:::::::::",_self.commentList)
                                // _self.listData = _self.listData.concat(result.Res);

                                _self.getUserInfo(result.Res);
                            }
                        } else if (_self.offset <= 0) {
                            _self.dataExist = 0;
                        }

                        _self.loadFlag = true;
                        // }.bind(this));
                    }, function (e) {
                        console.error("[comments].getComments.catch: ", _self.comments_retry_num, e);
                        _self.loadFlag = true;
                        _self.isLoadMore = false;
                        //_self.dataExist = 0;
                        if (_self.offset <= 0) {
                            _self.dataExist = 0;
                        }
                        if (e.Code && e.Code === 1002 && _self.comments_retry_num < _self.comments_retry_max) {
                            // if (_self.comments_retry_num < _self.comments_retry_max) {
                            _self.comments_retry_num += 1;
                            api.vGetToken();
                            _self.$nextTick(function () {
                                _self.getComments();
                            });
                        }
                    });
                };
                vGetCommentsList();
                //api.vGetCommentsList(params, {loading: true}).then(function (res) {
                //    var result = res.json();
                //    console.log('GET Comments SUCCESS: ', result);
                //    if (result.Code == 0 && result.Res && result.Res.length > 0) {
                //        var len = result.Res.length;
                //        if (len > 0) {
                //            _self.offset += len;
                //            _self.dataExist = 1;
                //
                //            /** 只返回数据, 根据请求数和返回数判断是否没数据了 */
                //            if (len < _self.limit) {
                //                _self.isLoadMore = false;
                //            }
                //
                //            //_self.$set("listData", _self.listData.concat(result.Res));
                //            result.Res.forEach(function (v) {
                //                v.timeStamp = timeStamp;//系统当前时间
                //            });
                //            _self.$set("commentList", _self.commentList.concat(result.Res));
                //            console.log("commentList:::::::::",_self.commentList)
                //            // _self.listData = _self.listData.concat(result.Res);
                //
                //            _self.getUserInfo(result.Res);
                //        }
                //    } else if (_self.offset <= 0) {
                //        _self.dataExist = 0;
                //    }
                //
                //    _self.loadFlag = true;
                //    // }.bind(this));
                //}, function (e) {
                //    console.error("[comments].getComments.catch: ", _self.comments_retry_num, e);
                //    _self.loadFlag = true;
                //    _self.isLoadMore = false;
                //    //_self.dataExist = 0;
                //    if (_self.offset <= 0) {
                //        _self.dataExist = 0;
                //    }
                //    if (e.Code && e.Code === 1002 && _self.comments_retry_num < _self.comments_retry_max) {
                //        // if (_self.comments_retry_num < _self.comments_retry_max) {
                //        _self.comments_retry_num += 1;
                //        api.vGetToken();
                //        _self.$nextTick(function () {
                //            _self.getComments();
                //        });
                //    }
                //});
            },

            /**
             * step 2. 补充用户信息
             *              -- Author by Dio Zhu. on 2017.1.6
             */
            getUserInfo: function (lis) {
                if (!lis) {
                    return;
                }
                var _self = this,
                    users_ids = [];

                //模拟用户假数据
                //_self.commentList.forEach(function (v, k) {
                //    if (!v.userInfo || !v.userInfo.title ) {
                //        _self.$set("commentList["+k+"].userInfo",{avatar: "http://static1.systoon.com/share/img/185x185.png", title: '未知用户'});
                //    }
                //    if (v.ToUserId && (!v.toUserInfo || !v.toUserInfo.title)) {
                //        _self.$set("commentList["+k+"].toUserInfo",{avatar: "http://static1.systoon.com/share/img/185x185.png", title: '未知用户'});
                //    }
                //});
                //console.log("[comments].getUserInfo: ", _self.commentList);
                //获取用户真数据
                lis.forEach(function (v) {
                    if (!_.contains(users_ids, v.UserId)) {
                        users_ids.push(v.UserId);
                    }
                    if (v.ToUserId && !_.contains(users_ids, v.ToUserId)) {
                        users_ids.push(v.ToUserId);
                    }
                });

                return api.vGetUserList({userIds: users_ids,appId:utils.appID,token:utils.token}).then(function (rtn) {
                    console.log("[comments].getUserInfo: ", rtn);

//                    for(var k = 0; k <= _self.commentList.length; k++){
//                        if (!_self.commentList[k].userInfo || !_self.commentList[k].userInfo .title ) {
//                            _self.$set("commentList["+k+"].userInfo", {avatar: rtn[k].userInfo.avatar, title: rtn[k].userInfo.name});
//                        }
//                        if(_self.commentList[k].ToUserId && (!_self.commentList[k].toUserInfo || !_self.commentList[k].toUserInfo.title)){
//                            _self.$set("listData["+k+"].toUserInfo", {avatar: rtn[k].userInfo.avatar, title: rtn[k].userInfo.name});
//                        }
//                    }
                    _self.commentList.forEach(function (v, k) { // 匹配用户数据
                        if (!v.userInfo || !v.userInfo.title ) {
                            _self.$set("commentList["+k+"].userInfo", _.find(rtn, function (i) { return i.userId == v.UserId; }) || {avatar: "", title: '未知用户'});
                        }
                        if (v.ToUserId && (!v.toUserInfo || !v.toUserInfo.title)) {
                            _self.$set("listData["+k+"].toUserInfo", _.find(rtn, function (i) { return i.userId == v.ToUserId; }) || {avatar: "", title: '未知用户'});
                        }

                    });
                    console.log("[comments].getUserInfo: ", _self.commentList);
                }, function (e) {
                    console.error("[comments].vGetUserList.error: ", e);
                });





                //lis.forEach(function (v) {
                //    if (!_.contains(users_ids, v.UserId)) {
                //        users_ids.push(v.UserId);
                //    }
                //    if (v.ToUserId && !_.contains(users_ids, v.ToUserId)) {
                //        users_ids.push(v.ToUserId);
                //    }
                //});
                //
                //return api.vGetUserList({userIds: users_ids}).then(function (rtn) {
                //    logger.log("[comments].getUserInfo: ", rtn);
                //
                //    _self.commentList.forEach(function (v, k) { // 匹配用户数据
                //        if (!v.userInfo || !v.userInfo.title ) {
                //            // logger.log("[comments].getUserInfo: ", v);
                //            // v.userInfo = _.find(rtn, function (i) { return i.id == v.UserId; }) || {avatar: "", title: '未知用户'};
                //            _self.$set("commentList["+k+"].userInfo", _.find(rtn, function (i) { return i.id == v.UserId; }) || {avatar: "", title: '未知用户'});
                //        }
                //        if (v.ToUserId && (!v.toUserInfo || !v.toUserInfo.title)) {
                //            _self.$set("listData["+k+"].toUserInfo", _.find(rtn, function (i) { return i.id == v.ToUserId; }) || {avatar: "", title: '未知用户'});
                //        }
                //    });
                //    logger.log("[comments].getUserInfo: ", _self.commentList);
                //}, function (e) {
                //    logger.error("[comments].vGetUserList.error: ", e);
                //});
            },
            deleatTopic:function(id){//删除话题
                var that = this;
                utils.deleteId = id;
                var params = {
                    appId:utils.appID,
                    token:utils.token,
                    id:Id,
                    userId:useId,
                    //name:this.detailData.type_name
                    noLoadMask:true
                };
                utils.ajax.post('/topic/delete',params,function(data){
                    console.log(that.detailData);
                    if(data.meta.code == 0){//
                        alert("删除话题成功");
                        //window.history.back();
                        setTimeout(function(){
                            //window.history.back();
                            if(routername == "search"){
                                utils.searchChangedFlag = 1
                            }
                            that.$dispatch("initForum");
                            utils.changedFlag = 1;
                            that.$parent.$data.refreshTag = true; // 设置返回时的加载标识，回去后更新列表
                            window.history.back();
                            //that.$dispatch("forum.getData(true)");
                            //location.href = location.origin+location.pathname+"#!/forum?id="+that.detailData.type_id+"&name="+that.detailData.type_name;
                            //location.href = location.origin+location.pathname+"#!/forum?id="+thisModule.type_id+"&name="+thisModule.type_name;
                        },2500);
                    }else{
                        that.errorFlag = 1
                    }
                })
            },

        }
    });

    return topicPage;
});