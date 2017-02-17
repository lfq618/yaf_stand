<div style="height: 100%;width:100%;">
    <div id="huati" v-show="$route.name == 'bbs-detail' || $route.name === 'bbs-search-detail'">
        <page-iscroll id="page-scroll-topic" v-bind:callback-fun="callbackFun" v-bind:is-load-more="isLoadMore" v-bind:load-flag="loadFlag">
        <div v-if="isEmpty">
           <div class="h_top">
            <!--左边图片-->
            <div class="person_pic" @click="goToexpert(detailData.user,false)">
                <img class="person_pic_span" v-bind:src="detailData.userInfo.avatar"/>
            </div>
            
            <!--右边信息-->
               <!--<p>{{detatilUrl}}</p>-->
            <div class="top_right">
                <!--人物名称-->
                <div class="person_mingzi">
                    <span class="person_mingzi_span1">{{detailData.userInfo.name}}</span>
                    <span class="defaultColor" v-bind:style="{'color':detailData.type_color}" v-bind:class="{'typeColorPink':detailData.type_id == 1,'typeColorBlue':detailData.type_id == 2}">{{detailData.type_name}}</span>
                </div>
                <!-- 标题 -->
                <p class="topic_tilte">{{detailData.title}}</p>
                <!--文字-->
                <div class="fabiao_text">{{detailData.abstract}}</div>
                <div class="fabiao_pic">
                    <span v-bind:class="{'one_pic':detailData.pics.length==1,'h_pic1':detailData.pics.length>1}" v-for="item in detailData.pics" track-by=$index @click="goToviewImage($index)">
                        <span v-if="detailData.pics.length == 1" v-bind:style="{'background-image': 'url('+item+'?imageView2/0/w/500'+')','background-repeat':'no-repeat','background-size':'cover','background-position':'center','background-position':'50% 50%','height':'100%','width':'100%'}"></span>
                        <span v-if="detailData.pics.length > 1" v-bind:style="{'background-image': 'url('+item+'?imageView2/0/w/400'+')','background-repeat':'no-repeat','background-size':'cover','background-position':'center','background-position':'50% 50%','height':'100%','width':'100%'}"></span>
                        <!-- <img v-bind:src="item" alt="" /> -->
                    </span>
                </div>
                <!--发布时间-->
                <div class="fabiao_bottom">
                    <div class="topic_time">
                        <p class="bottom_data">{{detailData.addtm}}<span v-show="detailData.time">{{detailData.time}}</span></p>
                        <p class="h_delete" v-if="isDeleat" @click="deleatTopic(detailData.id)">删除</p>
                    </div>
                    <v-comments-bar :id = "'CMT_'+currentItem.comment.Id" :comment.sync="currentItem.comment" :options="{ praiseEnable:true, commentEnable:true }"/>

                </div>
            </div>
           </div>

            <ul class="pinglun_message" style="padding-left:0.2666rem; background:#fff;">
            <li v-for=" (index,item) in commentList">
                <!--头像-->
                <div class="message_pic" @click="goToexpert(item,true)">
                    <span>
                        <img v-bind:src="item.userInfo.avatar" alt="" />
                    </span>
                </div>
                <!--右边信息-->
                <div class="right_message">
                    <div class="message_mingzi">
                        <i>{{item.userInfo.name}}</i>
                        <span class="isShow_huifu" v-if="item.to_name"><span>回复</span><span>{{item.toUserInfo.name}}</span></span>
                    </div>
                    <div class="message_text">{{item.Content}}</div>
                    <!--发布时间-->
                    <div class="fabiao_bottom">
                        <v-comments-bar :id = "'CMT_'+item.Id" :comment.sync="item" :options="{ praiseEnable:true, commentEnable:true }"/>
                    </div>
                </div>
            </li>
            </ul> 
        </div>
        <div class="h_forum_empty" v-if="!isEmpty"><!-- 无列表时显示 -->
            <div class="pic">
                <span class="iconfont"></span>
            </div>
            <h3>该话题不存在，去看看别的吧~</h3>
        </div>
        </page-iscroll>
        <!--<btn-scroll-top v-bind:scroll-element.sync="scrollId"></btn-scroll-top>-->
    </div>
    <div class="error_block" v-show="errorFlag">出了点小问题，<br/>程序猿正在玩命儿抢修中...</div>
    <router-view></router-view>
    <router-view v-bind:view-imagelist.sync="topicList" v-bind:init-index.sync="init_index"></router-view>
</div> 