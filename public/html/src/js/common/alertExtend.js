/***
 * 公共组件alert
 * ***/
define([
    'Vue',
    'text!comTplPath/alertExtend.tpl'
],function(Vue,tpl){

    var alertComponent =new Vue({
        el:".alert-load",
        template: tpl,
        data: {
            isDiaBox:false,
            isShow:false,
            isMask:false,
            msg:'',
            btnText:'',
            sureCb:Function,
            okCb: Function,
            cancelCb: Function,
            okString:""
        },
        ready:function(){
            var that = this;
            setTimeout(function(){
                that.isShow = false;
            },2000);
        },
        methods:{
            okClick: function(){
                this.okCb();
                this.isDiaBox = false;
            },
            cancelClick: function(){
                this.cancelCb();
                this.isDiaBox = false;
            },
            closeMask:function () {
                this.sureCb();
                this.isMask = false;
            }
        }

    });
    var showTimer = "";
    var alertFun = function(){

        var that = alertComponent;
        var argLength = arguments.length;

        if(argLength == 1){
            if(typeof(arguments[0]) === 'string'){
                if(showTimer)window.clearTimeout(showTimer);
                that.msg = arguments[0];
                that.isShow = true;
                showTimer = setTimeout(function(){
                    that.isShow = false;
                    showTimer = "";
                },2000);
            }
        }
        if(argLength == 3){
            if(typeof(arguments[0]) === 'string' && typeof(arguments[1]) === 'function' && typeof(arguments[2]) === 'function'){
                that.isDiaBox = true;
                that.msg = arguments[0];
                that.okCb = arguments[1];
                that.cancelCb = arguments[2];
            }
            if(typeof(arguments[0]) === 'string' && typeof(arguments[1]) === 'string' && typeof(arguments[2]) === 'function'){
                that.msg = arguments[0];
                that.btnText = arguments[1];
                that.sureCb = arguments[2];
                that.isMask = true;

            }
        }

        if(argLength == 4){
            if(typeof(arguments[0]) === 'string' && typeof(arguments[1]) === 'function' && typeof(arguments[2]) === 'function' && typeof(arguments[3]) === 'string'){
                that.isDiaBox = true;
                that.msg = arguments[0];
                that.okCb = arguments[1];
                that.cancelCb = arguments[2];
                that.okString = arguments[3];
            }
        }
    };

    return alertFun;

});