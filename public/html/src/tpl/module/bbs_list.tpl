
<div id="bbs-list" class="bbs-list" v-show="$route.name === 'bbs-list'">
    <!--<p @click="goDetail()">dafasdf</p>-->
    <!--<p @click="goRelease()">dafasdf</p>-->
    <!--论坛main-->
    <page-iscroll id="page-scroll-forum" v-bind:callback-fun="callbackFun" v-bind:is-load-more="isLoadMore" v-bind:load-flag="loadFlag">
        <div class="forum_main" v-if="items.length>0 && showFlag">
            <!--论坛banner-->
            <div class="forum-banner-wrap">
                <!--<banner-component v-bind:banner-image.sync="bannerImage"></banner-component>-->
                <!-- banner滚动 -->
                <div class="banner_wrap">
                    <div v-if="!bannerImage[0]" v-bind:style="{'background': 'url(./images/defaultBanner.png)','background-repeat':'no-repeat','background-size':'cover','background-position':'center','width':'100%','height':'100%'}"></div>
                    <div class="swiper-container bannerContainer" v-if="bannerImage[0]">
                        <ul class="swiper-wrapper">
                            <li class="swiper-slide" v-for="listItem in bannerImage" track-by="$index" @click="goBannerDetail(listItem.redirectUrl)"  v-bind:style="{'background': 'url('+listItem.picUrl+')','background-repeat':'no-repeat','background-size':'cover','background-position':'center'}"></li>
                        </ul>
                        <div class="swiper-pagination swiper-pagination-bannerContainer" v-if="bannerImage.length>1"></div>
                    </div>
                </div>
                <div class="search_box" @click="goToSearch()">
                <!--<div class="search_box">-->
                    <p>感兴趣的话题、感兴趣的人…</p>
                </div>
            </div>
            <ul class="forum_main_items">
                <!--<div class="h_avatar" v-if="feedId" @click="goSelf">-->
                    <!--<img v-bind:src="avatar" alt="" />-->
                <!--</div>-->
                <li class="forum_main-item" v-for="item in items" track-by="$index">
                    <!--人物头像-->
                    <img v-bind:src="item.userInfo.avatar" alt="" @click="goDaren(item.user)"/>
                    <!--右边信息-->
                    <!--<div class="top_right"  @click="goTopic(item.id,item.type_color)">-->
                    <div class="top_right" track-by="$index"  @click="goTopic(item,$index)">
                        <!--人物名称-->
                        <h1 class="person_mingzi">{{item.userInfo.name}}</h1>
                        <!--内容-->
                        <h2 class="fabiao_title" >{{item.title}}</h2>
                        <p class="fabiao_section">{{item.abstract}}</p>
                        <div class="fabiao_pic" v-show="item.pics.length>0">
                            <div v-for="pic in item.pics" track-by="$index" v-bind:class="{'h_only_one':item.pics.length==1,'h_pic1':item.pics.length>1}">
                                <div v-if="item.pics.length==1" v-bind:style="{'background': 'url('+pic+'?imageView2/0/w/500'+')','background-repeat':'no-repeat','background-size':'cover','background-position':'center'}"></div>
                                <div v-if="item.pics.length>1" v-bind:style="{'background': 'url('+pic+'?imageView2/0/w/400'+')','background-repeat':'no-repeat','background-size':'cover','background-position':'center'}"></div>
                            </div>

                        </div>
                        <!--发布时间-->
                        <div class="fabiao_bottom">
                            <v-comments-bar :id = "'CMT_'+$index_idx" :comment.sync="item.comment" :options="{}"/>
                            <!--<span class="bottom_data">{{item.selfTm}}</span>-->
                            <!--<span class="h_pinglun iconfont"></span>-->
                            <!--<span class="pinglun_num">{{item.comment_num}}</span>-->
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <div class="h_forum_empty" v-show="items.length<=0 && showFlag"><!-- 无列表时显示 -->
            <div class="pic">
                <span class="iconfont"></span>
            </div>
            <h3>此论坛暂时还没话题哦~</h3>
            <p @click="goRelease">发布话题</p>
        </div>
    </page-iscroll>
    <div class="goPinglun iconfont" @click="fabu" v-show="items.length>0">
    </div>
    <btn-scroll-top v-bind:scroll-element.sync="scrollId"></btn-scroll-top>
</div>
<div class="error_block" v-show="errorFlag">出了点小问题，<br/>程序猿正在玩命儿抢修中...</div>
<router-view></router-view>


