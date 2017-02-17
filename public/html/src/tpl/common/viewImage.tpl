
    <div class="swiper-container swiperContainer" id="viewImage" v-on:click="hideViewImage">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in viewImagelist" track-by=$index>
                <div v-bind:style="{'background-image': 'url('+item+')','background-repeat':'no-repeat','background-size':'contain','background-position':'center','background-position':'50% 50%','height':'100%','width':'100%'}"></div>
                <!-- <div style="background-image: url({{item}});background-position: 50% 50%;background-repeat: no-repeat;background-size: contain;"></div> -->
                <!-- <img v-bind:src="item" alt=""> -->
            </div>
        </div>
        <div class="swiper-count">
            <span>{{initIndex+1}}</span><em>/</em><span>{{viewImagelist.length}}</span>
        </div>
    <div>

