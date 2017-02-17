define([
    'Vue',
    'text!tplPath/bbs-create.tpl',
    'config',
    'common/api',
    'common/utils',
    'common/logger'
    // ,'common/v-comments-create'
], function (Vue, tpl, config, api, utils, logger) {

    return Vue.extend({
        template: tpl,
        route: {
            activate: function (transition) {
                transition.next();
            },
            data: function(transition){
                transition.next();
            },
            deactivate: function () { // hide all plugins on this page...

            }
        },
        data: function () {
            var _self = this;
            return {
                comments_retry_num: 0,   // 微服务重试次数（目前仅限于token类错误）
                comments_retry_max: 3,   // 微服务最大重试次数

                subjectId: _self.$route.query.id/1 || 0,
                toId: _self.$route.query.toid/1 || 0,
                toUserId: _self.$route.query.touid/1 || 0,

                contentMax: config.COMMENT_MAX, // 最大评论字数
                content: "" // 评论内容
            }
        },
        ready: function () {
            logger.log("comments create in ready: ");
            //this.$emit("init");
        },
        events: {

        },
        methods: {
            onBlur: function (e) {
                this.content = e.target.value; // 输入法状态切换input不会响应onchange事件, 需要在onblur时手动触发...
            },
            addComment: function () {
                var _self = this,
                    url = config.COMMENT_UTL + '/v1/comment',
                    params = { "appId": config.COMMENT_APPID, "token": config.COMMENT_TOKEN },
                    i, ilen, j, jlen;

                if (!this.content) {
                    this.$dispatch("dialog.show", "请输入有效评论");
                    logger.error("无效评论字数。。。");
                    return;
                }
                if (this.content.length > config.COMMENT_MAX) {
                    this.$dispatch("dialog.show", "评论字数最大不能超过："+ config.COMMENT_MAX);
                    logger.error("评论字数最大不能超过："+ config.COMMENT_MAX);
                    return;
                }

                logger.log("[comments].addComment: ", _self.subjectId);

                params.subjectId = _self.subjectId;
                params.userId = parseInt(config.loginData.userInfo.userId);
                params.content = this.content;
                params.toUserId = _self.toUserId;
                params.toId = _self.toId;

                Vue.http.post(url, params).then(function (res) {
                    var result = res.json();
                    logger.log("[comments].addComment.SUCCESS: ", result);
                    return new Promise(function(resolve, reject) {
                        if (result.Code != 0) { // 抛出异常
                            reject(result);
                        } else { // 正常处理
                            // logger.log("!!!!!!!!!!!", _self.$parent.$data.listData);
                            console.log("CXXXXX",_self.$parent._uid );
                            _self.$parent.$data.refreshTag = true; // 设置返回时的加载标识，回去后更新列表
                            window.history.back();
                            // _self.$router.go({name: "comments-info", query: {id: _self.subjectId}});
                        }
                    }.bind(this));
                }).catch(function (e) {
                    logger.error("[comments].addComment.ERROR: ", _self.comments_retry_num, e);
                    if ( e.Code && e.Code === 1002 && _self.comments_retry_num < _self.comments_retry_max) {
                        // if (_self.comments_retry_num < _self.comments_retry_max) {
                        _self.comments_retry_num+=1;
                        api.vGetToken();
                        _self.$nextTick(function () {
                            _self.addComment();
                        });
                    } else {
                        window.history.back();
                        // _self.$router.go({name: "comments-info", query: {id: _self.subjectId}});
                    }
                });
            }
        }
    });
});