<!--<div class="comments-bar" @click="goInfo">-->
<div class="comments-bar">
    <div class="comments-dt">{{formatedCreateDt || ''}}</div>
    <div v-if="options.praiseEnable" class="comments-praise"><span @click.stop="togglePraise" :class="['icon iconfont', {'icon-heart': !comment.done}, {'icon-heart-o': comment.LikeFlag}]"></span><p>{{ formatedPraiseNum }}</p></div>
    <div v-else class="comments-praise"><span :class="['icon iconfont', {'icon-heart': !comment.done}, {'icon-heart-o': comment.LikeFlag}]"></span><p>{{ formatedPraiseNum }}</p></div>
    <div v-if="options.commentEnable" class="comments-comment" @click.stop="addComment"><span class="icon iconfont icon-comments"></span><p>{{ formatedCommentNum }}</p></div>
    <div v-else class="comments-comment"><span class="icon iconfont icon-comments"></span><p>{{ formatedCommentNum }}</p></div>
</div>