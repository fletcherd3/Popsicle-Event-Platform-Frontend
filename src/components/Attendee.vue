<template>
    <div class="container">
        <div class="row mb-2">
            <div class="col-12">
                <el-card shadow="never">
                    <div class="row w-100 ml-1 mr-0">
                        <div class="row align-items-center">
                            <el-avatar class='mr-2' fit='cover' :size="40" :src="getAvatar()"
                                       icon="el-icon-user-solid"></el-avatar>
                            <div class="d-flex flex-column mx-1 info">
                                <span class="my-n1 p-0">
                                  <b>{{dAttendee.firstName}} {{dAttendee.lastName}}</b>
                                </span>
                                <span class="my-n1 p-0 text-muted">
                                    {{dAttendee.attendeeId == orgId ? 'Organiser' : 'Attendee'}}
                                </span>
                                <span class="my-n1 p-0 text-muted">
                                    {{moment(Date.parse(dAttendee.dateOfInterest)).fromNow()}}
                                </span>
                            </div>
                        </div>
                        <div v-if="isOrganizer" class="ml-auto mr-3">
                            <el-tooltip effect="dark" content="Accept into event" placement="right">
                                <el-button
                                        v-on:click="changeStatus('accepted')"
                                        :type="dAttendee.status === 'rejected' ? 'success' : null"
                                        icon="el-icon-check"
                                        circle
                                        :hidden="dAttendee.status === 'accepted'"
                                />
                            </el-tooltip>
                            <el-tooltip effect="dark" content="Reject from event" placement="right">
                                <el-button
                                        v-on:click="changeStatus('rejected')"
                                        :type="dAttendee.status === 'accepted' ? 'danger' : null"
                                        icon="el-icon-close"
                                        circle
                                        :hidden="dAttendee.status === 'rejected'"
                                />
                            </el-tooltip>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import {Api, SERVER_URL} from '../Api';

    export default {
        name: 'Attendee',
        data() {
            return {
                moment: require('moment'),
                dAttendee: this.$props.attendee
            };
        },
        props: {
            attendee: Object,
            orgId: Number,
            isOrganizer: Boolean,
            eventId: Number
        },
        methods: {
            getAvatar() {
                return SERVER_URL + "/users/" + this.$props.attendee.attendeeId + "/image";
            },
            changeStatus(newStatus) {
                Api.changeAttendeeStatus(this.$props.eventId, this.dAttendee.attendeeId, newStatus).then(res => {
                    if (res.status === 200) {
                        this.dAttendee.status = newStatus;
                        if (newStatus === 'accepted') {
                            this.$emit('changeAttendees', 1);
                        }
                        if (newStatus === 'rejected') {
                            this.$emit('changeAttendees', -1);
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .info {
        margin-top: 0;
        text-align: left;
    }

</style>