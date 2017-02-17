<div class="diaBox" v-show=isDiaBox>
    <div class="Dia_contain">
        <div class="Dia_title">{{msg}}</div>
        <div class="Dia_bottom">
            <span class="Dia_blue Dia_line" v-on:click="cancelClick">取消</span>
            <span class="Dia_red" v-on:click="okClick" v-bind:class="{'Dia_blue':okString && okString != ''}">{{okString||"确定"}}</span>
        </div>
    </div>
</div>
<div class="Title_hint" v-show=isShow>
    {{msg}}
</div>
<div class="confirm_window_wrap" v-show=isMask>
    <div class="confirm_window">
        <h3>{{msg}}</h3>
        <p v-on:click="closeMask">{{btnText}}</p>
    </div>
</div>