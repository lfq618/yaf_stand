<div class="bbs-select" v-show="$route.name === 'bbs-select'">
    <ul>
        <li v-for="typeItem in type_list" @click="goItemPage(typeItem)">{{typeItem.name}}</li>
    </ul>
</div>
<div class="error_block" v-show="errorFlag == 1">出了点小问题，<br/>程序猿正在玩命儿抢修中...</div>
