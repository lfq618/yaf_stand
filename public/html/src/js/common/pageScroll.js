define([
    'Vue',
    'text!comTplPath/pageScroll.tpl'
],function(Vue,tpl){
    var lastTop;
    var pageScroll = Vue.extend({
        el:function(){
            return "";
        },
        template:tpl,
        props: ["isLoadMore","callbackFun","loadFlag"],
        data:function(){
            return {
                isShowText:false,
                showFlag:1
            }
        },
        ready:function(){


        },
        methods:{
            onScroll:function(e){
                var _self = this;

                if(!_self.loadFlag) return;

                var timer;
                var remain = 150;
                var scrollHeight = e.target.scrollHeight;
                var scrollTop = e.target.scrollTop;
                var clientHeight = e.target.offsetHeight||window.innerHeight;
                if(scrollHeight >= remain + 50 && scrollHeight - scrollTop - clientHeight < remain){
                       _self.isLoadMore &&  _self.callbackFun && _self.callbackFun();
                }
                //超出一屏显示 "底线"
                var winHeight = document.body.clientHeight;
                if(scrollTop>winHeight){
                    _self.isShowText = true;
                    //this.$dispatch("hideInfo");
                }else{
                    _self.isShowText = false;
                    //this.$dispatch("showInfo");
                    //if(scrollTop < 410 && scrollTop > 350 && _self.showFlag === 0){
                    //    this.$dispatch("showInfo");
                    //    _self.showFlag = 1
                    //}else if(scrollTop >= 380 && _self.showFlag === 1){
                    //    this.$dispatch("hideInfo");
                    //    _self.showFlag = 0
                    //}
                }
            }
        }
    });

    Vue.component('page-iscroll',pageScroll);

});