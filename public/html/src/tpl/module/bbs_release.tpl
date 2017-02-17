<div>
    <div class="zb_releaseMain" id="zb_releaseMain" v-show="$route.name == 'bbs-release'">
        <!--选择版块-->
        <header v-bind:class="{'closed':!openFlag}">
            <!--三个以下板块时-->
            <div v-show="type_list.length <= 3">
                <p v-for="typeItem in type_list" @click="switchModuleLess(typeItem,1)" v-bind:class="{'on':typeItem.id == type_id}">{{typeItem.name}}</p>
            </div>
            <!--三个以上版块时，纯展示部分-->
            <!--<div v-show="!chooseFlag && type_list.length > 3">-->
                <!--<p v-for="typeItem in type_list" @click="switchModule(typeItem)" v-if="type_list.length > 3" v-bind:class="{'on':typeItem.typeId == type_id}">{{typeItem.name}}</p>-->
            <!--</div>-->
            <!--三个以上版块时，最后显示结果-->
            <div v-show="chooseFlag">
                <p class="on" v-if="type_list.length > 3">{{type_name}}</p>
            </div>
            <!--三个以上版块时，所有版块列表-->
            <ul id="section_list" v-show="!chooseFlag && type_list.length > 3">
                <li v-for="typeItem in type_list" @click="switchModule(typeItem)" v-bind:class="{'on':typeItem.id == type_id}">{{typeItem.name}}</li>
            </ul>
            <h1>所属版块</h1>
            <h2 @click="openModuleList()" v-if="type_list.length > 3"></h2>
        </header>
        <section  class="zb_releaseContainer">
            <div class="zb_releaseTitle">
                <!--<input type="text" placeholder="请输入标题" v-model="title" maxlength="30"  @input="MaxLength">-->
                <div class="textContain">
                    <textarea placeholder="请输入标题" id="titleInput" v-model="title" oninput="var val = this.value;if(val.length>30)val = val.substr(0,30);this.value = val;this.style.height = this.scrollHeight+'px';" onpropertychange="var val = this.value;if(val.length>30)val = val.substr(0,30);this.value = val;this.style.height = this.scrollHeight+'px';"></textarea>
                </div>
            </div>
            <div class="zb_releaseContent">
                <textarea class="zb_editBox" placeholder="请输入内容" v-model="content" maxlength="5000"></textarea>
                <div class="zb_uploadPicture">
                   <dl v-for="pic in pics" track-by="$index" >
                       <dt :style="{backgroundImage: 'url(' + pic + ')'}" @click="viewImage($index)"></dt>
                       <dd><span class="icon_delete" @click="deleteUploadImage($index)"></span></dd>
                   </dl>
                   <div @click="uploadImage" v-show="isShowAddPic">
                       <img src="images/add_pice.png" alt=""/>
                   </div>
                </div>
            </div>
        </section>
        
    </div>
    <footer class="zb_goTorelease" @click="goSubmit">
        <div v-bind:class="{'btn-disable':!isActiveBtn}">提交发布</div>
    </footer>
    <div class="error_block" v-show="errorFlag">出了点小问题，<br/>程序猿正在玩命儿抢修中...</div>
    <router-view v-bind:view-imagelist.sync="pics" v-bind:init-index.sync="init_index"></router-view>
</div>