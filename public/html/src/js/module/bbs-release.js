define([
    'Vue',
    'text!tplPath/bbs_release.tpl',
    "config",
    'common/utils',
    'common/alertExtend',
    'common/viewImage'
],function(Vue,tpl,config,utils,alert,viewImage){

    var release = {},thisModule,uploadFlag;
    release.init = function(thisModule){
        //var params  = JSON.parse(thisModule.$route.query.params);
        //thisModule.type_id      = params.id;
        //thisModule.type_name    = params.name;
        //console.log(thisModule.type_name);
        //var poi = JSON.parse(utils.cookie.get("poiInfo"));
        //if(poi.poi_type && poi.poi_type == 120390){
        //    utils.shareMetaSetting(1,"");
        //}
        thisModule.$emit('getTypeList');
    };
    release.tpl = Vue.extend({
        el:function(){
            return "#zb_releaseMain";
        },
        template:tpl,
        route: {
            activate: function (transition) {
                thisModule  = this;//保存当前激活组件模型
                uploadFlag  = true;
                transition.next();
                release.init(thisModule);
            },
            data:function(transition){
                transition.next();
            }
        },
        data:function(){
            return {
                pics    : [],
                title   : null,
                content : null,
                isShowAddPic : true,
                init_index:0,
                type_id :0,
                type_name: '社区论坛',
                type_list:[],
                isActiveBtn:true,
                openFlag:0,
                errorFlag:0,
                chooseFlag:0,
                selectFlag:0
            }
        },
        //ready:function(){
        //
        //},
        events: {
            getTypeList:function(){
                var that = this;
                var params = {};
                params.appId = utils.appID;
                params.token = utils.token;
                params.toonType = utils.toontype;
                utils.ajax.post('/forum/list',params,function(e){
                    console.log("typelist:::",e)
                    if(e.meta.code == '0'){
                        console.log("______________",e.data);
                        that.type_list = e.data.dataList;
                    }else{
                        that.errorFlag = 1
                    }
                });
            }
        },
        methods:{
            /**
             * 点击箭头，展示列表或收缩列表
             */
            openModuleList:function(){
                var that = this;
                if(that.openFlag){//当前状态为列表全部展示，则设置为取消全部展示
                    if(that.selectFlag == 1){
                        that.chooseFlag = 1;
                    }
                    that.openFlag = 0;
                    document.getElementById("section_list").scrollTop = 0
                }else {
                    that.chooseFlag = 0;
                    that.openFlag = 1;
                }
            },
            /**
             * 3个以上板块选择
             * @param typeItem
             * @param operatorCode
             */
            switchModule:function(typeItem,operatorCode){
                var that = this;
                if(!operatorCode){
                    that.openFlag = 0;
                    document.getElementById("section_list").scrollTop = 0
                }
                if(typeItem){
                    that.chooseFlag = 1;
                    that.selectFlag = 1;
                    that.type_id = typeItem.id;
                    that.type_name = typeItem.name;
                    console.log(typeItem.name,typeItem.id)
                }
            },
            /**
             * 3个以下板块选择
             * @param typeItem
             * @param operatorCode
             */
            switchModuleLess:function(typeItem,operatorCode){
                var that = this;
                if(typeItem){
                    that.type_id = typeItem.id;
                    that.type_name = typeItem.name;
                    console.log(typeItem.name,typeItem.id)
                }
            },
            uploadImage:function(){//上传图片
                if(!uploadFlag) return;

                var total = 9;
                if(thisModule.pics.length>=total){
                    alert("最多上传9张图片");
                    return false;
                }
                var old_length = this.pics.length;
                var length = total-old_length;
                uploadFlag  = false;
                uploadImages({"functionType":2,"maxCount":length/*,"aspectX":1,"aspectY":1*/,type:1},function(e){
                    if(e){
                        if(e != 'cancel') thisModule.pics = thisModule.pics.concat(e);
                    }
                    uploadFlag  = true;
                });
            },
            deleteUploadImage:function( index ){
                thisModule.pics.splice(index,1);
            },
            goSubmit:function(){
                var that = this;
                if(!thisModule.goSubmit) return;
                var params = {};
                params.appId = utils.appID;
                params.token = utils.token;
                params.toonType = utils.toontype;
                /*params.userInfo = {
                    userId:12,
                    name:"无赖",
                    subtitle:"过年",
                    avatar:"http://scloud.toon.mobi/f/VDzWLz5-5VMuIvHGsgog13pOaPthnmlcCfAKeaVq3xsfG.jpg"
                }*/
                params.userInfo = config.loginData.userInfo;
                if(!thisModule.type_id){
                    alert('请选择论坛版块');
                    return false;
                }
                if(!thisModule.title){
                    alert('请输入标题');
                    return false;
                }
                params.title    = thisModule.title;
                if(!thisModule.content){
                    alert('请输入内容');
                    return false;
                }
                if(!(thisModule.content.replace( /^\s*/, ''))){
                    alert('请输入内容');
                    return false;
                }
                params.content  = thisModule.content;

                if(!thisModule.pics){
                    alert('请上传图片');
                    return false;
                }
                console.log("thisModule.type_id:::",thisModule.type_id)
                params.forumId  = thisModule.type_id;
                params.pics  = thisModule.pics;
                thisModule.isActiveBtn = false;
                utils.ajax.post('/topic/add/',params,function(e){
                    if(e.meta.code == '0'){
                        alert("发布成功");

                        setTimeout(function(){
                            utils.changedFlag = 1;
                            thisModule.$route.router.go({name:"bbs-list",query: {typeId: thisModule.type_id,typeName: thisModule.type_name}});
//                            location.href = location.origin+location.pathname+"#!/?typeId="+thisModule.type_id+"&typeName="+thisModule.type_name;
                        },2500);
                    }else{
                        alert("发布失败");
                        thisModule.isActiveBtn = true;
                    }
                });
            },
            viewImage:function( index ){
                this.init_index = index;
                this.$route.router.go({path:"viewImage",append:true});
            },
            MaxLength:function(){
                var self = this;
                var len = self.title.length;
                if(len >= 30){
                    alert("最多可输入30个字");
                    self.title = self.title.substr(0,30);
                    return false;
                }else{
                    var reg=/(^\s*)/g;
                    self.title = self.title.replace(reg,'');
                    return  self.title;
                }
            }
        },
        watch:{
            'pics': function(n){
                if(thisModule.pics.length == 9){
                    thisModule.isShowAddPic = false;
                }else{
                    thisModule.isShowAddPic = true;
                }
            }
        }
    });

    return release;
});