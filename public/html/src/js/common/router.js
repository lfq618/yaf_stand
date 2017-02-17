
define([
        'Vue',
        'VueRouter',
        'fastclick',
        'config',
        'common/api',
        'common/utils',
        'lib/vue-lazyload.es5',
        'common/pageScroll',
        'common/viewImage',
        '_'
    ],
    function(Vue,VueRouter,fastclick,config,api,utils,VueLazyload,_) {

        fastclick.attach(document.body);
        Vue.use(VueRouter);
        Vue.use(VueLazyload, {
            preLoad: 1.3,
            error: '/html/src/images/img/lazy_bg.jpg',
            loading: '/html/src/images/img/lazy_bg.jpg',
            try: 2
        });
        //首次模块加载loading效果处理
        var getComponent = function(name,loading){
            var fn;
            if(loading === 0){
                fn = function (resolve) {
                    require([name], function (param) {
                        resolve(param.tpl);
                    },function(err){
                        alert("请求失败");
                    });
                }
            }else{
                fn = function (resolve) {
                    //首次加载模块打开Loading遮罩
                    document.getElementById("loading-wrapper").style.display = "block";
                    require([name], function (param) {
                        resolve(param.tpl);
                        //加载完毕，关闭遮罩
                        document.getElementById("loading-wrapper").style.display = "none";
                    },function(err){
                        //加载失败，关闭遮罩
                        document.getElementById("loading-wrapper").style.display = "none";
                        alert("请求失败");
                    });
                }
            }
            return fn;
        };
        var router = new VueRouter();
        var App = Vue.extend({});
        router.map({
            "/root": {
                name: "root",
                component: {
                    template: ""
                }
            },
            'bbs-list': {//论坛列表页
                name: 'bbs-list', // 给这条路径加上一个名字
                component:getComponent("module/bbs-list"),
                subRoutes: {
                    '/bbs-detail': {//话题详情页
                        name: 'bbs-detail', // 给这条路径加上一个名字
                        component:getComponent("module/bbs-detail"),
                        subRoutes: {
                            '/viewImage': {//查看大图
                                name: 'viewImage', // 给这条路径加上一个名字
                                component:  function (resolve) {
                                    require(['common/viewImage'], function(param){
                                        resolve(param);
                                    })
                                }
                            },
                            '/comments-create': { // 新建
                                name: 'bbs-create',
                                component: function (resolve) {
                                    require(['module/bbs-create'], function (module) {
                                        resolve(module);
                                    });
                                }
                            }
                        }
                    },
                    '/bbs-search': {//论坛搜索页
                        name: 'bbs-search', // 给这条路径加上一个名字
                        component: getComponent("module/bbs-search"),
                        subRoutes: {
                            '/bbs-search-detail': {//话题详情页
                                name: 'bbs-search-detail', // 给这条路径加上一个名字
                                component: getComponent("module/bbs-detail"),
                                subRoutes: {
                                    '/viewImage': {//查看大图
                                        name: 'viewImage', // 给这条路径加上一个名字
                                        component:  function (resolve) {
                                            require(['common/viewImage'], function(param){
                                                resolve(param);
                                            })
                                        }
                                    },
                                    '/comments-search-create': { // 新建
                                        name: 'bbs-search-create',
                                        component: function (resolve) {
                                            require(['module/bbs-create'], function (module) {
                                                resolve(module);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/bbs-release': {//论坛列表页
                name: 'bbs-release', // 给这条路径加上一个名字
                component: getComponent("module/bbs-release")
            },
            '/bbs-select': {//分类列表页
                name: 'bbs-select', // 给这条路径加上一个名字
                component: getComponent("module/bbs-select")
            }
        });
        router.setTitle = function(title){
            document.title = title;
            try{
                setTitle(title);
            }catch (e){}
        };
        router.afterEach(function(transition){
            var name = transition.to.name;
            if(config.setTitle == true){
                if(name ==='bbs-select'){
                    router.setTitle("分类列表");
                }else if(name === "bbs-list"){
                    var forumTitle = window.localStorage.getItem("forumName");
                    if(forumTitle){router.setTitle(forumTitle);}
                }else if(name == "bbs-search"){
                    router.setTitle("搜索");
                }else if(name === "bbs-detail" || name === "bbs-search-detail"){
                    router.setTitle("话题页");
                }else if(name === "bbs-create" || name === "bbs-search-create"){
                    router.setTitle("评论");
                }else if(name === "viewImage"){
                    router.setTitle("查看大图");
                }else if(name === "bbs-release"){
                    router.setTitle("发布");
                }
            }else{
                router.setTitle("微论坛服务");
            }

        });
        router.start(App, '#container');
        /***初始页面加载***/
        //router.replace({name:"bbs-select"});
        /*
        * */
        var vTokenFlag = false, tokenFlag = false;
        api.GetToken().then(function (token) {
            console.log("utils-token",token);
            if(token){
                utils.token = token;
                tokenFlag = true;
                if(vTokenFlag && tokenFlag){
                    router.replace({name: "bbs-select"});
                }
            }else{
                alert("登录失败");
            }
        });
        //清除入口自带的路由状态，统一由root初始化，保证先登录再进应用
        api.vGetToken().then(function (token) {
            console.log("token",token);
            if(token){
                config.COMMENT_TOKEN = token;
                vTokenFlag = true;
                if(vTokenFlag && tokenFlag){
                    router.replace({name: "bbs-select"});
                }
            }else{
                alert("登录失败");
            }
        });

        //utils.getToken();
        //router.replace({name: "bbs-select"});
        //.then(function (data) {
        //    console.log("utils---token",data.data.token);
        //    if(data.data.token){
        //        utils.token = data.data.token;
        //        router.replace({name: "bbs-select"});
        //    }else{
        //        alert("登录失败");
        //    }
        //});

        /*
         * 存储用户体信息，有效期为1个小时，超过一个小时重新获取
         *
         * */
        config.getUserInfo = function(){
            var _tm = new Date().getTime();
            var that = this;
            utils.ajax.post(config.min_userInfo_url,{code:config.code},function(data){
                console.log("user_info:::::",data);
                if(data.meta.code == 0){
                    config.loginData.userInfo.userId = data.data.userId;
                    config.loginData.userInfo.name = data.data.name;
                    config.loginData.userInfo.subtitle = data.data.subtitle;
                    config.loginData.userInfo.avatar = data.data.avatar;
                    config.loginData.userInfo.feedId = data.data.params.feedId;
                    config.local.setItem("userInfo",JSON.stringify(config.loginData.userInfo));
                    config.local.setItem("time",_tm);
                    console.log("获取用户信息并存储");
                }else {
                    that.errorFlag = 1
                }
            });
        };
        config.getUserData = function(){
            if(!config.local.getItem("userInfo")){
//        config.getUserData();
                config.getUserInfo();
            }else{
                var tm = parseInt(config.local.getItem("time"));
                var temp_flag = config.MillisecondToDate(tm);
                if(!temp_flag){
//            config.getUserData();
                    config.local.clear();
                    config.getUserInfo();
                    console.log("超时获取用户信息并存储");
                }else{
                    config.loginData.userInfo = JSON.parse(config.local.getItem("userInfo"));
                }
            }
        };
        config.getUserData();
        return router;
    }
);
