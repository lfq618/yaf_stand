/***
 * log工具,可在congfig中配置
 *              - Author By Dio Zhu. on 2016.9.20
 * 之前用apply方式无法在后面显示实际调用地址，debug不爽，后改为bind方式。。。世界瞬间美好了~~~
 *              - Author By Dio Zhu. on 2016.12.23
 ***/
define(["config", "common/utils"], function (config, utils) {
    /* var logger = {
     log: function () {
     if(window.console && console.log && config && config.DEBUG){
     var str = "["+utils.formatTime(new Date(), 'hh:mm:ss ms')+"]",
     args = Array.prototype.slice.call(arguments),
     fn;
     args.unshift(str);
     args.push("[" + utils.getCurrentPath() + "." + logger.log.caller.name + "]");
     console.log.apply(console, args);
     }
     },
     error: function (con) {
     if(window.console && console.log && config && config.DEBUG){
     var str = "["+utils.formatTime(new Date(), 'hh:mm:ss ms')+"]";
     var args = Array.prototype.slice.call(arguments);
     args.unshift(str);
     args.push("[" + utils.getCurrentPath() + "." + logger.error.caller.name + "]");
     console.error.apply(console, args);
     }
     },
     warn: function (con) {
     if(window.console && console.log && config && config.DEBUG){
     var str = "["+utils.formatTime(new Date(), 'hh:mm:ss ms')+"]";
     var args = Array.prototype.slice.call(arguments);
     args.unshift(str);
     args.push("[" + utils.getCurrentPath() + "." + logger.warn.caller.name + "]");
     console.warn.apply(console, args);
     }
     }
     };
     return logger;*/

    /**
     * 原型修改方式，针对个别不喜欢用logger封装方式的特殊处理
     *          -- Author by Dio Zhu. on 2016.12.23
     */
    if (window.console && console.log && config && config.DEBUG) {
        var timestamp = function () {
        };
        timestamp.toString = function () {
            return "[" + utils.formatTime(new Date(), 'hh:mm:ss ms') + "]";
        };

        // console.log = console.log.bind(console, timestamp);
        console.log = console.log.bind(console);
        console.error = console.error.bind(console);
        console.warn = console.warn.bind(console);
    } else {
        console.log = function () {};
    }

    /**
     * 封装console的几个常用方法, 在最前面加入了时间戳，便于Debug时查看延时情况
     *          -- Author by Dio Zhu. on 2016.12.23
     */
    var logger = (function () {
        var timestamp = function () {},
            logFunc = function () {},
            errorFunc = function () {},
            warnFunc = function () {};
        timestamp.toString = function () {
            return "[" + utils.formatTime(new Date(), 'hh:mm:ss ms') + "]"
                +  "[" + utils.getCurrentPath({pathOnly: true})+"]"
                ;
        };

        if (window.console && console.log && config && config.DEBUG) {
            logFunc = console.log.bind(console, '%s', timestamp);
        }
        errorFunc = console.error.bind(console, '%s', timestamp);
        warnFunc = console.warn.bind(console, '%s', timestamp);
        return {
            log: logFunc,
            error: errorFunc,
            warn: warnFunc
        };
    })();

    return logger;
});