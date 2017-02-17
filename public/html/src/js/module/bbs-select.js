define([
    'Vue',
    'text!tplPath/bbs-select.tpl',
    'common/utils',
    'common/alertExtend'
],function(Vue,tpl,utils,alert){

    var release = {},thisModule,uploadFlag;
    release.init = function(thisModule){
        thisModule.$emit('getTypeList');
    };
    release.tpl = Vue.extend({
        el:function(){
            return ".bbs-select";
        },
        template:tpl,
        route: {
            activate: function (transition) {
                thisModule  = this;//保存当前激活组件模型
                transition.next();
                release.init(thisModule);
            },
            data:function(transition){
                transition.next();
            }
        },
        data:function(){
            return {
                type_list:[],
                errorFlag:0
            }
        },
        ready:function(){

        },
        events: {
            getTypeList:function(){
                var that = this;
                var params = {};
                params.appId = utils.appID;
                params.token = utils.token;
                params.toonType = utils.toontype;
                if(!params.token){
                    that.$emit("aginGetToken");
                }else{
                    utils.ajax.post('/forum/list',params,function(e){
                        console.log("typelist:::",e);
                        if(e.meta.code == '0'){
                            console.log("______________",e.data);
                            that.type_list = e.data.dataList;
                        }else{
                            that.errorFlag = 1
                        }
                    });
                }
            },
            aginGetToken:function(){
                var that = this;
                utils.getToken();
                setTimeout(function(){
                    if(!utils.token){
                        that.$emit("aginGetToken");
                    }else{
                        that.$emit("getTypeList");
                    }
                },300);
            }
        },
        methods:{
            goItemPage:function(typeItem){
                this.$route.router.go({name:"bbs-list",query: {typeId: typeItem.id,typeName: typeItem.name}});
            }
        }
    });

    return release;
});