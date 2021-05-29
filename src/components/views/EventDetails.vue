<template>
    <div class="container">
        <div class="col-12">
            <el-card shadow="always">
                <div class="row">
                    <div class="col-12 w-100 p-0">
                        <div class="rounded-circle">
                            <el-image
                                :src="getImage()"
                                onerror="javascript:this.src='https://www.weahsn.net/wp-content/themes/reticulum/images/event-default-small.jpg'"
                                style="width: 100%; max-height: 400px"
                                fit="cover">
                            </el-image>
                        </div>

                    </div>
                </div>
                <div class="row mt-2">
                    <div class="row w-100">
                        <div class="datetime mr-2">{{moment(Date.parse(event.date)).format('Do MMM YYYY')}}</div>
                        <div class="datetime ">{{moment(Date.parse(event.date)).format('h:mm a')}}</div>
                        <div class="ml-auto mr-3">
                            <h4 v-if="event.fee != 0">${{event.fee}}</h4>
                            <h4 v-else>Free Event</h4>
                        </div>
                    </div>
                    <div class="row w-100 align-items-center">
                        <h3 class="mt-1 text-wrap info">{{event.title}}</h3>
                        <div class="ml-auto mr-3 mt-2" v-if="Date.parse(event.date) > new Date()">
                            <el-button class="mb-2" v-if="attendanceStatus === 'not_going'" v-on:click="attendEvent"
                                       type="primary"
                                       icon="el-icon-s-ticket"
                                       :disabled="event.attendeeCount >= event.capacity" round>Attend
                            </el-button>
                            <el-button class="mb-2" v-if="attendanceStatus === 'accepted'" icon="el-icon-s-ticket"
                                       v-on:click="leaveEvent" round>Leave Event
                            </el-button>
                            <el-button class="mb-2" v-if="attendanceStatus === 'pending'" icon="el-icon-s-ticket"
                                       v-on:click="leaveEvent" round>Cancel Request
                            </el-button>
                            <el-button class="mb-2"
                                       v-if="userId === event.organizerId"
                                       v-on:click="editEvent" icon="el-icon-edit" round>Edit
                            </el-button>
                            <el-popconfirm
                                    class="mb-2"
                                    v-if="userId === event.organizerId "
                                    title="Are you sure to delete your event?"
                                    v-on:confirm="deleteEvent"
                            >
                                <template #reference>
                                    <el-button type="danger" icon="el-icon-delete" round>Delete</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </div>
                </div>
                <div class="row w-100 info mt-3">
                    <div class="col-8 description">
                        <h4>About this event</h4>
                        {{event.description}}
                    </div>
                    <div class="col-md-4">
                        <div class="my-2">
                            <b>Host</b><br/>
                            <div class="row align-items-center">
                                <el-avatar class='mr-2' fit='cover' :size="40" :src="getHostAvatar()"
                                           icon="el-icon-user-solid"></el-avatar>
                                <div>{{event.organizerFirstName}} {{event.organizerLastName}}</div>
                            </div>

                        </div>
                        <div v-if="event.venue" class="my-2">
                            <b>Location</b><br/>
                            {{event.venue}}
                        </div>
                        <div class="my-2">
                            <b>Attendees</b><br/>
                            {{event.attendeeCount ? event.attendeeCount : 0}} attending
                        </div>
                        <div class="my-2">
                            <b>Capacity</b><br/>
                            {{event.capacity}} people
                        </div>
                        <div v-if="event.url">
                            <b>Link</b><br/>
                            <a :href="event.url">{{event.url}}</a>
                        </div>
                        <div class="my-2">
                            <b>Categories</b><br/>
                            <div class="row">
                                <div v-for="c in event.categories" v-bind:key="c">
                                    <el-tag class="mr-1 mb-1" size="small">{{cMap[c]}}</el-tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="my-3" shadow="always">
                <el-collapse @change="loadSimilar">
                    <el-collapse-item title="Attendees">
                        <div v-if="attendees.length === 0">
                            <el-empty description="This event has no attendees" :image-size="200"></el-empty>
                        </div>
                        <el-row>
                            <div class="col-lg-6" v-for="attendee in attendees" :key="attendee.attendeeId">
                                <Attendee @changeAttendees="changeAttendees" :attendee="attendee"
                                          :orgId="event.organizerId"
                                          :isOrganizer="userId === event.organizerId" :eventId="eventId"/>

                            </div>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item title="Similar Events">
                        <div v-if="similarEvents.length === 0">
                            <el-empty description="There are no similar events" :image-size="200"></el-empty>
                        </div>
                        <el-row>
                            <div v-for="event in similarEvents" :key="event.eventId"
                                 class="my-0 col-12 col-md-6 col-lg-4">
                                <EventCard
                                        :id="event.eventId"
                                        :title="event.title"
                                        :date="event.date"
                                        :hostFName="event.organizerFirstName"
                                        :hostSName="event.organizerLastName"
                                        :attendees="event.numAcceptedAttendees"
                                        :categories="event.categories"
                                />
                            </div>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {Api, SERVER_URL} from '../../Api';
    import {cMap} from '../../categoriesMap';
    import EventCard from '../EventCard';
    import Attendee from '../Attendee';

    export default {
        name: 'EventDetails',
        data() {
            return {
                moment: require('moment'),
                cMap: null,
                event: {
                    date: null,
                    fee: null,
                    title: null,
                    description: null,
                    organizerId: null,
                    organizerFirstName: null,
                    organizerLastName: null,
                    attendeeCount: null,
                    capacity: null,
                    isOnline: null,
                    url: null,
                    venue: null,
                    requiresAttendanceControl: null,
                    categories: []
                },
                attendees: [],
                similarEvents: [],
                attendanceStatus: 'not_going',
                cancelAttdTxt: 'Leave Event'
            };
        },
        props: {
            eventId: Number,
            userId: Number,
            isAuthenticated: Boolean
        },
        components: {
            EventCard,
            Attendee
        },
        async mounted() {
            this.cMap = cMap;
            this.getEvent(this.$props.eventId);
            this.getAttendees(this.$props.eventId);
        },
        methods: {
            getImage() {
                return SERVER_URL + "/events/" + this.$props.eventId + "/image";
            },
            getEvent(eventId) {
                Api.getEvent(eventId).then(res => {
                    if (res.status === 200) {
                        this.event = res.data;
                    }
                });
            },
            getAttendees(eventId) {
                Api.getAttendees(eventId).then(res => {
                    let result = res.data;
                    result = result.sort((a, b) => (new Date(a.dateOfInterest) < new Date(b.dateOfInterest)) ? 1 : -1);
                    this.attendees = result;
                    this.updateAttendanceStatus();
                });
            },
            updateAttendanceStatus() {
                let status;
                let interested = this.attendees.filter((attendee) => {
                    return attendee.attendeeId === this.$props.userId
                });
                if (interested.length) {
                    status = interested[0].status;
                } else {
                    status = 'not_going';
                }
                this.attendanceStatus = status;
            },
            getHostAvatar() {
                return SERVER_URL + "/users/" + this.event.organizerId + "/image";
            },
            loadSimilar() {
                // Only search for similar events if the event has categories and only search once
                if (this.event.categories.length > 0 && this.similarEvents.length === 0) {
                    let params = {};
                    params.categoryIds = this.event.categories;
                    Api.getEvents(params).then(res => {
                        this.similarEvents = res.data.filter(event => event.eventId !== this.$props.eventId);
                    });
                }
            },
            changeAttendees(inc) {
                this.event.attendeeCount += (inc);
            },
            editEvent() {
                this.$router.push({name: 'Edit Event', params: {eventId: this.$props.eventId}});
            },
            deleteEvent() {
                Api.deleteEvent(this.$props.eventId).catch((err) => {
                    if (err) {
                        this.$message.error('An error occurred when deleting your event');
                    }
                }).then(res => {
                    if (res.status === 200) {
                        this.$router.push({name: 'Events'});
                    }
                });
            },
            attendEvent() {
                if (!this.$props.isAuthenticated) {
                    this.$router.push({name: 'Sign In'});
                }
                Api.attendEvent(this.$props.eventId).catch((err) => {
                    if (err) {
                        this.$message.error('An error occurred when trying to attend the event');
                    }
                }).then((res) => {
                    if (res.status === 201) {
                        if (!this.event.requiresAttendanceControl) {
                            this.event.attendeeCount += 1;
                        }
                        this.getAttendees(this.$props.eventId);
                    }
                });
            },
            leaveEvent() {
                Api.leaveEvent(this.$props.eventId).catch((err) => {
                    if (err) {
                        this.$message.error('An error occurred when trying to leave the event');
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        if (!this.event.requiresAttendanceControl) {
                            this.event.attendeeCount -= 1;
                        }
                        this.getAttendees(this.$props.eventId);
                    }
                });
            }
        },
        watch: {
            $route: {
                handler(val) {
                    if (val.name === 'Event Details') {
                        this.$router.go();
                    }
                },
                deep: true
            },
        },
    }
</script>

<style scoped>
    .row {
        margin: 0;
    }

    .datetime {
        font-size: 15px;
        color: #999;
    }

    .info {
        text-align: left;
    }

    .description {
        white-space: pre-wrap;
        padding: 0;
    }
</style>
