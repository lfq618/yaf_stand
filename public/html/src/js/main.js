require.config({
    waitSeconds: 200,
    paths: {
        core: 'http://img.icon.systoon.com/icon/apr/js/base/core',
        Vue: 'http://img.icon.systoon.com/icon/apr/js/lib/vue.min', //----------------------------上线需要改动
        VueRouter:"http://img.icon.systoon.com/icon/apr/js/lib/vue-router.min",
        VueResource:"http://img.icon.systoon.com/icon/apr/js/lib/vue-resource.min",
        text: 'http://img.icon.systoon.com/icon/apr/js/lib/text',
        fastclick:"http://img.icon.systoon.com/icon/apr/js/lib/fastclick",
        swiper:"http://img.icon.systoon.com/icon/apr/js/lib/swiper-3.3.1.min",
        router:"common/router",
        tplPath:"../tpl/module",
        comTplPath:"../tpl/common",
        es6promise:"lib/es6-promise",
        VueLazyload:"lib/vue-lazyload.es5",
        _:"lib/underscore.min"
    },
    shim: {
        'VueRouter':{
            deps: ['Vue']
        },
        'VueResource':{
            deps: ['Vue']
        },
        '_':{
            exports: '_'
        },
        'core':{
            exports: 'core'
        }
    },
    //map映射
    map: {

    }
});

require(["common/router"]);
