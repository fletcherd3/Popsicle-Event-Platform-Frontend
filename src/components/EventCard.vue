<template>
    <button class="container btn m-0" v-on:click="goToEvent">
        <el-card :body-style="{ padding: '0px' }"
                 shadow="hover"
        >
            <el-image
                :src="getImage()"
                onerror="javascript:this.src='https://www.weahsn.net/wp-content/themes/reticulum/images/event-default-small.jpg'"
                style="width: auto; height: 310px"
                fit="cover">
            </el-image>
            <div style="padding: 14px;">
                <span>{{$props.title}}</span>
                <div class="mt-1 container w-100">
                    <div class="row w-100">
                        <div class="ml-3 w-100">
                            <div class="row">
                                <span class="datetime ">{{moment(Date.parse(date)).format('Do MMM YY')}}</span>
                                <div class="datetime ml-auto">By {{[hostFName, hostSName].join(' ')}}</div>
                            </div>
                            <div class="row">
                                <span class="datetime ">{{moment(Date.parse(date)).format('h:mm a')}}</span>
                                <div class="datetime ml-auto">{{attendees}} attending</div>
                            </div>
                        </div>


                    </div>
                    <div class="row mt-2">
                        <div v-for="c in categories" v-bind:key="c">
                            <el-tag class="mr-1 mb-1" size="small">{{cMap[c]}}</el-tag>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </button>
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
            categories: Array
        },
        created() {
            this.cMap = cMap;
        },
        methods: {
            getImage() {
                return SERVER_URL + "/events/" + this.$props.id + "/image";
            },
            goToEvent() {
                this.$router.push({name: 'Event Details', params: {eventId: this.$props.id}});
            }
        },
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