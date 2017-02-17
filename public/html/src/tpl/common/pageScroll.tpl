<div class="page-scroll" v-on:scroll="onScroll($event)">
    <slot></slot>
    <span class="bottom-text" v-if="!isLoadMore && isShowText">——没有更多信息了——</span>
<div>