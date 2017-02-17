define([
    'Vue',
    'text!comTplPath/viewImage.tpl',
    'swiper'
],function(Vue,tpl){

    var swiper;
    var viewImageComponent = Vue.extend({
        el:function(){
            return "#viewImage";
        },
        template:tpl,
        props: ["initIndex", "viewImagelist"],
        data:function(){
            return {

            }
        },
        ready:function(){
            var self = this;
            console.log("@@@@@",this.initIndex,swiper);

            if(swiper){
                swiper.destroy(false);
                swiper = null;
            }
            swiper = new Swiper('.swiperContainer',{
                mode: 'horizontal',
                initialSlide:self.initIndex,
                observer:true,
                observeParents:true,
                onSlideChangeEnd:function(event){
                    self.initIndex = swiper ? swiper.activeIndex : self.initIndex;
                }
            });
        },
        methods:{
            hideViewImage:function(){
                window.history.back();
            }
        },
        watch:{

        }
    });
    return viewImageComponent;

});