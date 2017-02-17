/**
 * Created by 135946 on 2016/9/12.
 */
define([
    'Vue'
],function(Vue){
    var scrollTop = Vue.extend({
        el:function(){
            return "#toTop";
        },
        template:'<span id="toTop" v-bind:class="className||defaultClass" v-on:click="scrollTop" v-show="showBtn"></span>',
        props: ["scrollElement","btnClass"],
        data:function(){
            return {
                showBtn:false,
                defaultClass:"sxw_toTop"
            }
        },
        ready:function(){
            this.$emit("scrollInit");
        },
        methods:{
            scrollTop:function(){
                var $el = document.getElementById(this.scrollElement) || document.getElementsByClassName(this.scrollElement)[0];
                $el.scrollTop =0;
            }
        },
        events:{
            scrollInit:function(){
                var vm = this;
                var el = document.getElementById(this.scrollElement) || document.getElementsByClassName(this.scrollElement)[0];
                if(!el){
                    console.error("未获得滚动元素！");
                    return;
                }
                var winHeight = document.body.clientHeight;
                if(el.onscroll)return;
                el.onscroll = function(){
                    var elScroll = el.scrollTop;
                    if(elScroll>winHeight){
                        vm.showBtn = true;
                        //vm.$dispatch("hideInfo");
                    }else{
                        vm.showBtn = false;
                        //vm.$dispatch("showInfo");
                    }
                }
            }
        }
    });

    Vue.component('btn-scroll-top',scrollTop);
    //return scrollTop;

});