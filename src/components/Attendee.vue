<template>
    <div class="container">
        <div class="row mb-2">
            <div class="col-12">
                <el-card shadow="never">
                    <div class="row w-100">
                        <div class="row align-items-center">
                            <el-avatar class='mr-2' fit='cover' :size="40" :src="getAvatar()" icon="el-icon-user-solid"></el-avatar>
                            <div class="d-flex flex-column mx-1 info">
                                <span class="my-n1 p-0">
                                  <b>{{attendee.firstName}} {{attendee.lastName}}</b>
                                </span>
                                <span class="my-n1 p-0 text-muted">
                                    {{attendee.attendeeId == orgId ? 'Organiser' : 'Attendee'}}
                                </span>
                                <span class="my-n1 p-0 text-muted">
                                    {{moment(Date.parse(attendee.dateOfInterest)).fromNow()}}
                                </span>
                            </div>
                        </div>
                        <div v-if="attendee.attendeeId !== orgId" class="ml-auto mr-3">
                            <el-button type="success" icon="el-icon-check" circle></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle></el-button>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import {SERVER_URL} from '../Api';

    export default {
        name: 'Attendee',
        data() {
            return {
                moment: require('moment')
            };
        },
        props: {
            attendee: Object,
            orgId: Number
        },
        methods: {
            getAvatar() {
                return SERVER_URL + "/users/" + this.$props.attendee.attendeeId + "/image";
            }
        }
    }
</script>

<style scoped>
    .info {
        text-align: left;
    }

</style>