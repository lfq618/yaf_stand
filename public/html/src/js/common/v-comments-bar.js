define([
    'Vue',
    'text!comTplPath/v-comments-bar.tpl',
    'config',
    'common/api',
    'common/utils',
    'common/logger'
], function (Vue, tpl, config, api, utils, logger) {

    var module = Vue.extend({
        template: tpl,
        props: ["id", "comment", "options", "commentsFunc"],
        data: function () {
            var _self = this;
            return {
                // subjectId: _self.$route.query.id/1 || 0,
                // userId: config.loginData.userInfo.userId || 0,
                // toId: _self.$route.query.tid/1 || 0,
                //subjectId: (_self.comment && _self.comment.SubjectId)? _self.comment.SubjectId : 0,
                //userId: (_self.comment && _self.comment.UserId)? _self.comment.UserId: 0,
                //toId: (_self.comment && _self.comment.Id)? _self.comment.Id: 0,
                subjectId: (_self.comment && _self.comment.id)? _self.comment.id : 0,
                userId: (_self.comment && _self.comment.UserId)? _self.comment.UserId: 0,
                toId: (_self.comment && _self.comment.Id)? _self.comment.Id: 0,
            }
        },
        computed: {
            formatedCreateDt: {
                get: function () {
                    return utils.formatTime(this.comment.Tm,this.comment.timeStamp,'yyyy-MM-dd hh:mm');
                    return this.comment.Tm;
                },
                set: function (val) {
                    this.comment.Tm = val;
                }
            },
            formatedPraiseNum: function () {
                return (this.comment.LikeNum)? this.comment.LikeNum: '赞';
            },
            formatedCommentNum: function () {
                console.log("公共",this.comment.CommentNum);
                return (this.comment.CommentNum)? this.comment.CommentNum: '评论';
            }
        },
        ready: function () {
            if (!this.comment) { this.comment = {}; }
            if (!this.comment.LikeNum) { this.comment.LikeNum = 0; }
            if (!this.comment.CommentNum) { this.comment.CommentNum = 0; }

            // logger.log("this.comment ==> ", JSON.stringify(this.comment));
        },
        events: {
            initToken: function () {
                /**
                 * TOKEN
                 */
                if (!config.COMMENT_TOKEN) {
                    api.vGetToken().then(function (res) {
                        logger.log("GET TOKEN: ", res);
                    }, function (e) {
                        logger.error("GET TOKEN ERROR: ", e);
                    });
                }

            }
        },
        methods: {
            togglePraise: function (e) {
                var _self = this,
                    params = {};

                logger.log("[comments].togglePraise: ", this.comment);

                params.userId = _self.userId;

                if (!this.comment.LikeFlag) {
                    //params.subjectId = _self.comment.SubjectId || 0;
                    params.subjectId = _self.comment.SubjectId || 0;
                    params.toId = _self.comment.Id || 0;
                    params.type = 1;

                    // logger.log("!!!!!!!!!!!!!", params);return;
                    api.vAddPraise(params).then(function (res) {

                        _self.$set("comment.LikeFlag",true);
                        _self.$set("comment.LikeNum", _self.comment.LikeNum + 1 );
                        // e.target.classList.remove("cancel").add("aone");
                        if (e.target.classList.contains("cancel")) { e.target.classList.remove("cancel"); }
                        e.target.classList.add("done");
                        config.praise.refreshTag = true;
                    },function (e) {
                        logger.error("post praise error: ", e);
                    });
                } else {
                    //params.subjectId = _self.comment.SubjectId || 0;
                    params.subjectId = _self.comment.SubjectId || 0;
                    // params.id = _self.toId;
                    params.cId = _self.comment.Id || 0;
                    api.vDelPraise(params).then(function(res) {
                        _self.$set("comment.LikeFlag",false);
                        _self.$set("comment.LikeNum", _self.comment.LikeNum - 1 );
                        // e.target.classList.remove("done").add("cancel");
                        if (e.target.classList.contains("done")) { e.target.classList.remove("done"); }
                        e.target.classList.add("cancel");
                        config.praise.refreshTag = true;
                    }, function (e) {
                        logger.error("delete praise error: ", e);
                    });
                }
            },
            addComment: function () {
                logger.log("[comments].addComment: ");
                // if (typeof this.commentsFunc == "function") {
                //     this.commentsFunc();
                // }
                if(utils.localpage == "bbs-detail"){
                    this.$router.go({name: 'bbs-create', query: {id: this.comment.SubjectId, toid: this.comment.Id, touid: this.comment.UserId}});
                }else if(utils.localpage == "bbs-search-detail"){
                    this.$router.go({name: 'bbs-search-create', query: {id: this.comment.SubjectId, toid: this.comment.Id, touid: this.comment.UserId}});
                }
                //this.$router.go({name: 'bbs-create', query: {id: this.comment.SubjectId, toid: this.comment.Id, touid: this.comment.UserId}});


            }
            //goInfo: function () {
            //    this.$route.router.go({name: "comments-info"});
            //}
        },
    });

    Vue.component('v-comments-bar', module);
});