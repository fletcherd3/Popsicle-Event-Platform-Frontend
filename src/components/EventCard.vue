<template>
    <div class="container">
        <el-card :body-style="{ padding: '0px' }" >
            <el-image
                :src="getImage()"
                onerror="javascript:this.src='https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png'"
                style="width: auto; height: 310px"
                fit="cover">
            </el-image>
            <div style="padding: 14px;">
                <span>{{$props.title}}</span>
                <div class="mt-1 container w-100">
                    <div class="row">
                        <div class="col-6">
                            <div class="row">
                                <span class="datetime ">{{moment(Date.parse(date)).format('Do MMM YY')}}</span>
                            </div>
                            <div class="row">
                                <span class="datetime ">{{moment(Date.parse(date)).format('h:mm a')}}</span>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="row">
                                <div class="datetime">By {{[hostFName, hostSName].join(' ')}}</div>
                            </div>
                            <div class="row">
                                <div class="datetime">{{attendees}} attending</div>
                            </div>
                        </div>

                    </div>
                    <div class="row">
                        <div v-for="c in categories" v-bind:key="c">
                            <el-tag class="mr-1 mb-1" size="small">{{cMap[c]}}</el-tag>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {cMap} from '../categoriesMap';
    import {SERVER_URL} from '../Api';

    export default {
        name: 'EventCard',
        data() {
            return {
                moment: require('moment'),
                cMap: null
            };
        },
        props: {
            id: Number,
            title: String,
            date: String,
            hostFName: String,
            hostSName: String,
            attendees: Number,
            categories: Array,
        },
        created() {
            this.cMap = cMap;
        },
        methods: {
            getImage() {
                return SERVER_URL + "/events/" + this.$props.id + "/image";
            }
        }
    }
</script>

<style scoped>
    .datetime {
        font-size: 13px;
        color: #999;
    }

    .image {
        width: 100%;
        display: block;
    }
</style>