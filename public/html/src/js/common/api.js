/**
 * 接口处理, 若跨域, 请设定根目录app.js中的代理
 *              -- Created by Dio Zhu on 2016.11.7
 */
define(['Vue', 'config', 'common/utils', 'common/logger', 'common/promise'], function (Vue, config, utils, logger, promise$1) {

    var Promise = Promise || promise$1;

    var post = function (uri, params, opts) {
        logger.log("in post: ", uri, params, opts);
        if (opts && opts.loading) {
            logger.log("...start loading...");
            config.loading(true, uri);
        }
        logger.log('POST START...');
        return Vue.http.post(uri, params).then(function (res) {
            //logger.log("POST: ", uri, params);
            //logger.log("RESULT: ", res);
            if (opts && opts.loading) {
                config.loading(false, uri + "  1"); // 隐藏加载框
            }
            var result = res.json();
            if (result.code == 0 || result.meta.code == 0) {
                //logger.log("POST SUCCESS", uri, JSON.stringify(result.data));
                return Promise.resolve(result.data);
            } else {
                //logger.warn("POST ERROR-1", uri, JSON.stringify(result.msg));
                return Promise.reject(result.msg);
            }
        }, function (err) {
            logger.error("POST ERROR-2", uri, err.message);
            if (!opts || opts.loading) {
                config.loading(false, uri + "  2"); // 隐藏加载框
            }
            return Promise.reject(err);
        }).catch(function (err) {
            logger.error(err);
            return Promise.reject(err);
        });
    };
    var jsonp = function (uri, params, opts) {
        logger.log("in jsonp: ", uri, params, opts);
        if (opts && opts.loading) {
            logger.log("...start loading...");
            config.loading(true, uri);
        }
        logger.log('JSONP START...');
        return Vue.http.jsonp(uri, params).then(function (res) {
            logger.log("JSONP: ", uri, JSON.stringify(params));
            logger.log("RESULT: ", JSON.stringify(res));
            if (opts && opts.loading) {
                config.loading(false, uri + "  1"); // 隐藏加载框
            }
            var result = res.json();
            if (result.code == 0) {
                //logger.log("POST SUCCESS", uri, JSON.stringify(result.data));
                return Promise.resolve(result.data);
            } else {
                //logger.warn("POST ERROR-1", uri, JSON.stringify(result.msg));
                return Promise.reject(result.msg);
            }
        }, function (err) {
            logger.error("JSONP ERROR", uri, JSON.stringify(err));
            if (!opts || opts.loading) {
                config.loading(false, uri + "  2"); // 隐藏加载框
            }
            return Promise.reject(err);
        }).catch(function (err) {
            logger.error("ERROR: ", JSON.stringify(err));
            return Promise.reject(err);
        });
    };
    var get = function (uri, params, opts) {
        //logger.log('GET START...', uri, params, opts);
        if (opts && opts.loading) {
            logger.log("...start loading...");
            config.loading(true, uri);
        }
        return Vue.http.get(uri, params).then(function (res) {
            logger.log("GET: ", uri, JSON.stringify(params));
            logger.log("RESULT: ", JSON.stringify(res));
            if (opts && opts.loading) {
                config.loading(false, uri + "  1"); // 隐藏加载框
            }
            var result = res.json();
            if (result.code === 0 || result.code === '001' || (result.meta && result.meta.code == 0) || result.Code===0) {
                logger.log("GET SUCCESS", uri, JSON.stringify(result.data));
                return Promise.resolve(result.data);
            } else {
                logger.warn("GET ERROR-1", uri, JSON.stringify(result.msg));
                return Promise.reject(result.msg || result.Msg || result.meta.message);
            }
        }, function (err) {
            //logger.error("GET ERROR-2", uri, err.message);
            if (!opts || opts.loading) {
                config.loading(false, uri + "  2"); // 隐藏加载框
            }
            return Promise.reject(err);
        }).catch(function (err) {
            logger.error(err);
            return Promise.reject(err);
        });
    };

    return {
        ///* ===================== 评论相关接口 START ===================== */
        /**
         * 向当前app服务请求微服务的token
         * 注意: 这里是向当前APP的服务端请求token, 而不是微服务!
         *              -- Author by Dio Zhu. on 2016.12.25
         */
        vGetToken: function (params, opts) {
            //var uri = config.url + '/api/comment/token';
            var uri = config.COMMENT_TOKEN_URL;
            //var uri = 'http://172.28.50.173:8080/v1/ticket/2';
            var param = params || {};
            return post(uri, param, opts).then(function (res) {
                // if (config) {
                    config.COMMENT_TOKEN = res.token;
                    logger.log("REFRESH COMMENT TOKEN: ", config.COMMENT_TOKEN);
                    return Promise.resolve(res.token);
                // }
            });
        },
        /**
         * 向当前app服务请求微服务的token
         * 注意: 这里是向当前APP的服务端请求token, 而不是微服务!
         *              -
         */
        GetToken: function (params, opts) {
            //var uri = config.url + '/api/comment/token';
            var uri = config.min_token_url;
            //var uri = 'http://172.28.50.173:8080/v1/ticket/2';
            var param = {appId:utils.appID};
            return post(uri, param, opts).then(function (res) {
                // if (config) {
                utils.token = res.token;
                logger.log("utils-token:::",utils.token)
                return Promise.resolve(res.token);
                // }
            });
        },
        /**
         * 获取主题列表，主题列表页中显示的各个主题的总的回复、点赞情况，根据业务表中的[SubjectId]进行检索
         *              -- Author by Dio Zhu. on 2017.1.5
         */
        vGetSubjectList: function (params, opts) {
            var uri = config.COMMENT_UTL + '/v1/comment/subject?',
                param = params || {},
                key;
            if (!params.ids) {
                return Promise.reject({msg: '无效的SubjectIds'});
            }
            param.appId = config.COMMENT_APPID;
            param.token = config.COMMENT_TOKEN;
            param.userId = config.loginData.userInfo.userId;

            // param.limit = config.limit || 10;
            for(key in param){
                if(param.hasOwnProperty(key)) {
                    uri += key + "=" + encodeURIComponent(param[key]) + "&";
                }
            }
            // return get(uri, param, opts);
            return Vue.http.get(uri);
//            return this.vGetToken().then(function (token) {
//                // uri = uri + params.ids + "?";
//                param.appId = config.COMMENT_APPID;
//                param.token = config.COMMENT_TOKEN;
//                param.userId = config.loginData.userInfo.userId;
//                // param.limit = config.limit || 10;
//                for(key in param){
//                    if(param.hasOwnProperty(key)) {
//                        uri += key + "=" + encodeURIComponent(param[key]) + "&";
//                    }
//                }
//                // return get(uri, param, opts);
//                return Vue.http.get(uri);
//            });
        },
        /**
         * 获取评论列表，详情页的针对某个主题的回复列表
         *              -- Author by Dio Zhu. on 2016.12.25
         */
        vGetCommentsList: function (params, opts) {
            var uri = config.COMMENT_UTL + '/v1/comment?',
            // var uri = config.url + '/api/comment/list?',
                param = params || {},
                key;
            param.appId = config.COMMENT_APPID;
            param.token = config.COMMENT_TOKEN;
            param.userId = config.loginData.userInfo.userId;
            // param.limit = config.limit || 10;
            for(key in param){
                if(param.hasOwnProperty(key)) {
                    uri += key + "=" + encodeURIComponent(param[key]) + "&";
                }
            }
            // return get(uri, param, opts);
            return Vue.http.get(uri);
        },
        /**
         * 获取点赞列表，详情页的针对某个主题的点赞列表
         *              -- Author by Dio Zhu. on 2017.1.3
         */
        vGetPraiseList: function (params, opts) {
            var uri = config.COMMENT_UTL + '/v1/like?',
            // var uri = config.url + '/api/comment/list?',
                param = params || {},
                key;
            param.appId = config.COMMENT_APPID;
            param.token = config.COMMENT_TOKEN;
            // param.limit = config.limit || 10;
            for(key in param){
                if(param.hasOwnProperty(key)) {
                    uri += key + "=" + encodeURIComponent(param[key]) + "&";
                }
            }
            // return get(uri, param, opts);
            return Vue.http.get(uri);
        },

        /**
         * 添加评论
         *              -- Author by Dio Zhu. on 2016.12.25
         */
        vAddComment: function (params, opts) {
            var uri = config.COMMENT_UTL + '/comment/add';
            var param = params || {};
            param.limit = config.limit || 10;
            return post(uri, param, opts);
        },
        /**
         * 删除评论
         *              -- Author by Dio Zhu. on 2016.12.25
         */
        vDelComment: function (params, opts) {
            var uri = config.COMMENT_UTL + '/comment/del';
            var param = params || {};
            param.limit = config.limit || 10;
            return post(uri, param, opts);
        },
        /**
         * 点赞/踩
         *              -- Author by Dio Zhu. on 2016.11.25
         */
        vAddPraise: function (params, opts) {
            var uri = config.COMMENT_UTL + '/v1/like';
            var param = params || {};
            param.appId = config.COMMENT_APPID;
            param.token =config.COMMENT_TOKEN;
            param.userId = parseInt(config.loginData.userInfo.userId);

            // return post(uri, param, opts);
            return Vue.http.post(uri, param);
        },
        /**
         * 取消点赞/踩
         *              -- Author by Dio Zhu. on 2016.11.25
         */
        vDelPraise: function (params, opts) {
            var uri = config.COMMENT_UTL + '/v1/like?',
                param = params || {},
                key;
            param.appId = config.COMMENT_APPID;
            param.token =config.COMMENT_TOKEN;
            param.userId = parseInt(config.loginData.userInfo.userId);
            // uri += '/' + (param.id) + '?';
            for(key in param) {
                if (param.hasOwnProperty(key)) {
                    uri += key + "=" + encodeURIComponent(params[key]) + "&";
                }
            }

            // return post(uri, param, opts);
            return Vue.http.delete(uri);
        },

        /**
         * 根据评论赞微服务的用户id，获取本地用户列表，补充用户信息（头像、名称、推广语等）
         *              -- Author by Dio Zhu. on 2017.1.3
         */
        vGetUserList: function (params, opts) {
            //var uri = config.url + '/api/getUserList';
            var uri = 'http://p100.ms-bbs.systoon.com/test/user';
            var param = params || {};
            return post(uri, param, opts);
        },

        ///* ===================== 评论相关接口 END ===================== */

        /** 获取列表信息 */
        getRandomList: function (params, opts) {
            //logger.log("common.api.getList: check post() ", post);
            var uri = config.url + '/api/getRandomList'; // 列表显示
            //var uri = config.url + '/api/getlist_empty'; // 空页显示
            var param = params || {};
            param.session = (config.loginData) ? config.loginData.session || '' : '';
            return post(uri, param, opts);
            //return jsonp(uri, param, opts);
        },
        /** 获取列表信息 */
        getList: function (params, opts) {
            //logger.log("common.api.getList: check post() ", post);
            var uri = config.url + '/api/getlist'; // 列表显示
            //var uri = config.url + '/api/getlist_empty'; // 空页显示
            var param = params || {};
            param.session = (config.loginData) ? config.loginData.session || '' : '';
            param.limit = config.limit || 10;
            return post(uri, param, opts);
            //return jsonp(uri, param, opts);
        },
        /**
         * 获取图片列表信息
         */
        getImgList: function (params, opts) {
            var uri = config.url + '/api/getImgList'; // 列表显示
            var param = params || {};
            param.session = (config.loginData) ? config.loginData.session || '' : '';
            param.limit = config.limit || 10;
            return post(uri, param, opts);
        },
        /** 获取banner */
        getBanner: function (params, opts) {
            var uri = config.url + '/api/getbanner';
            var param = params || {};
            return post(uri, param, opts);
        },
        /**
         * 获取内容数据
         *              -- Author by Dio Zhu. on 2016.11.7
         */
        getReaderInfo: function (params, opts) {
            //logger.log("common.api.getList: check post() ", post);
            //var uri = config.url + '/trends?rssId=581da777e4b0cb4c00140ed3';
            var uri = config.readerurl + '/trends?',
                param = params || {},
                key;

            for(key in param){
                if(param.hasOwnProperty(key)) {
                    uri += key + "=" + encodeURIComponent(param[key]) + "&";
                }
            }
            return get(uri, param, opts);
        },


        login: function () {
            var flag = config.logintype;
            var uri = null;
            var params = null;
            if (flag >= 100 && flag < 200) {
                uri = config.url + '/plugin/portalLogin';
                params = {
                    "namespace": config.namespace,
                    "logintype": flag,
                    "frame": "af",
                    "key": config.key,
                    "openId": config.openId,
                    "code": config.code
                };
            } else {
                uri = config.url + '/plugin/login';
                params = {
                    "namespace": config.namespace,
                    "certificate": config.certificate,
                    "logintype": flag,
                    "frame": config.frame,
                    "code": config.code
                };
            }
            return post(uri, params).then(function (data) {
                config.loginData = data;
                return Promise.resolve(data);
            });
        },
        top5: function () {
            var uri = config.url + '/board/reclist';
            var params = {
                "session": config.loginData.session,
                "namespace": config.namespace,
                "limit": 5,
                "offset": 1
            };
            return post(uri, params, {loading: false});
        },
        details: function (id) {
            var uri = config.url + '/board/details';
            var params = {
                "session": config.loginData.session,
                "namespace": config.namespace,
                "entityId": id
            };
            return post(uri, params);
        },
        add: function (content) {
            var uri = config.url + '/board/add';
            var params = {
                "session": config.loginData.session,
                "namespace": config.namespace,
                "title": content.title,
                "details": content.details,
                "urlname": content.urlname,
                "url": content.url,
                "source": content.source,
                "image": content.image
            };
            return post(uri, params);
        },
        modify: function (id, content) {
            var uri = config.url + '/board/update';
            var params = {
                "session": config.loginData.session,
                "namespace": config.namespace,
                "title": content.title,
                "details": content.details,
                "urlname": content.urlname,
                "url": content.url,
                "source": content.source,
                "image": content.image,
                "entityId": id
            };
            return post(uri, params);
        },
        del: function (id) {
            var uri = config.url + '/board/del';
            var params = {
                "session": config.loginData.session,
                "namespace": config.namespace,
                "entityId": id
            };
            return post(uri, params);
        },
        selfDel: function (id) {
            var uri = config.url + '/board/delself';
            var params = {
                "session": config.loginData.session,
                "namespace": config.namespace,
                "entityId": id
            };
            return post(uri, params);
        },
        recommend: function (id, top) {
            var uri = config.url + '/board/recommend';
            var params = {
                "session": config.loginData.session,
                "namespace": config.namespace,
                "entityId": id,
                "top": top
            };
            return post(uri, params);
        },
        doLike: function (id) {
            var uri = config.url + '/rss/doLike';
            var params = {
                "session": config.loginData.session,
                "namespace": config.namespace,
                "entityId": id
            };
            return post(uri, params, {loading: false});
        },

        /**
         * 添加评论
         *              -- Author by Dio Zhu. on 2016.12.25
         */
        vGetUserInfo: function (params, opts) {
            var uri = config.url + config.min_userInfo_url;
            var param = params || {};
            param.limit = config.limit || 10;
            return post(uri, param, opts);
        },
    }
});