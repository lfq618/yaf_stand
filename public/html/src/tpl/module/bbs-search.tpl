<div class="search_page" v-show="$route.name === 'bbs-search'">
    <page-iscroll id="page-scroll-search" v-bind:callback-fun="callbackFun" v-bind:is-load-more="moreDataFlag" v-bind:load-flag="loadFlag">
        <!--搜索栏-->
        <header>
            <h1></h1>
            <input v-model="keyWord" placeholder="感兴趣的话题、感兴趣的人…" type="search"/>
            <h2 @click="clearText()"></h2>
            <h3 @click="goSearch(1)">搜索</h3>
        </header>
        <!--搜索结果-->
        <ul v-show="resultFlag">
            <li v-for="resultItem in resultList.dataList" @click="goTopic(resultItem,$index)">
                <img :src="resultItem.userInfo.avatar" title="头像">
                <section>
                    <h1>{{resultItem.userInfo.name[0]}} <span v-if="resultItem.userInfo.name[2] == true">{{resultItem.userInfo.name[3]}}</span>{{resultItem.userInfo.name[1]}}</h1>
                    <h2>{{resultItem.title[0]}}<span v-if="resultItem.title[2] == true">{{resultItem.title[3]}}</span>{{resultItem.title[1]}}</h2>
                    <!--<p>{{resultItem.abstract[0]}}<span v-if="resultItem.abstract[2] == true">{{resultItem.abstract[3]}}</span>{{resultItem.abstract[1]}}</p>-->
                    <p>{{resultItem.abstract}}</p>
                    <span>{{resultItem.addtm}}</span>
                    <v-comments-bar :id = "'CMT_'+$index_idx" :comment.sync="item.comment" :options="{}"/>
                </section>
            </li>
        </ul>
        <!--无搜索结果-->
        <div class="noResult" v-if="resultFlag == 0">抱歉，未找到您想找的，换个词试试……</div>
    </page-iscroll>
</div>
<div class="error_block" v-show="errorFlag == 1">出了点小问题，<br/>程序猿正在玩命儿抢修中...</div>
<router-view></router-view>
