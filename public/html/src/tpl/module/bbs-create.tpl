<div class="page-comments-create">
    <!--<v-comments-create :placeholder="请输入评论内容~" :btnValue="发布评论"></v-comments-create>-->
    <section class="comments-create">
        <textarea class="comments-create-txt" placeholder="请输入评论内容" v-model="content" @blur="onBlur"></textarea>
        <a class="btn btn-primary btn-comments-submit" @click="addComment">发布评论</a>
    </section>

</div>

