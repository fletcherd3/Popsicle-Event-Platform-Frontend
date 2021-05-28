<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <el-card shadow="always">

                    <el-form :model="query" ref="query">
                        <div class="row">
                            <el-form-item class="col-md-6">
                                <el-input v-model="query.search" placeholder="Search for an event"></el-input>
                            </el-form-item>
                            <el-form-item class="col-md-3">
                                <el-select class="w-100" v-model="query.sortBy" placeholder="Sort by">
                                    <el-option label="Earliest" value="DATE_ASC"></el-option>
                                    <el-option label="Latest" value="DATE_DESC"></el-option>
                                    <el-option label="Attendees" value="ATTENDEES_ASC"></el-option>
                                    <el-option label="Attendees descending" value="ATTENDEES_DESC"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="col-md-3">
                                <el-cascader
                                        class="w-100"
                                        placeholder="Select tags"
                                        v-model="query.tags"
                                        :options="options"
                                        :props="props"
                                        clearable>
                                </el-cascader>
                            </el-form-item>
                        </div>
                        <el-button class="mr-4" type="primary" v-on:click="sendQuery">Find Events</el-button>
                        <el-checkbox v-if="$props.isAuthenticated" v-model="myEvents">My Events</el-checkbox>
                    </el-form>
                </el-card>
                <el-row class="mt-2">
                    <div v-for="event in slicedEvents" :key="event.eventId" class="my-0 col-12 col-md-6 col-lg-4">
                        <EventCard
                                :id="event.eventId"
                                :title="event.title"
                                :date="event.date"
                                :hostFName="event.organizerFirstName"
                                :hostSName="event.organizerLastName"
                                :attendees="event.numAcceptedAttendees"
                                :categories="event.categories"
                                :key="0"
                        />
                    </div>
                </el-row>
                <div v-if="events.length === 0">
                    <el-empty description="Hmm, I couldn't find what you want" :image-size="200"></el-empty>
                </div>
                <el-row class="justify-content-center mt-4">
                    <el-pagination
                            class="my-3"
                            layout="total, sizes, prev, pager, next"
                            v-model:currentPage="currentPage"
                            :total="events.length"
                            @size-change="handleSizeChange"
                            @current-change="handlePageChange"
                            :page-sizes="[5, 10, 20, 50]"
                            :page-size="eventsPerPage"
                    >
                    </el-pagination>
                </el-row>

            </div>
        </div>
    </div>
</template>

<script>
    import {Api} from '../../Api';
    import {options} from '../../categoriesMap';
    import EventCard from '../EventCard';

    export default {
        name: 'Events',
        components: {
            EventCard
        },
        data() {
            return {
                props: {multiple: true},
                options: options,
                myEvents: false,
                query: {
                    search: '',
                    count: null,
                    sortBy: 'DATE_ASC',
                    tags: []
                },
                events: [],
                slicedEvents: [],
                currentPage: 1,
                eventsPerPage: 10
            };
        },
        props: {
            userId: Number,
            isAuthenticated: Boolean
        },
        mounted() {
            this.sendQuery();
        },
        methods: {
            sendQuery() {
                let params = {};

                if (this.query.tags.length > 0) {
                    params.categoryIds = this.query.tags.map(el => parseInt(el[0], 10))
                }
                if (this.query.search) {
                    params.q = this.query.search;
                }
                if (this.query.count) {
                    params.count = this.query.count;
                }
                if (this.myEvents) {
                    params.organizerId = this.$props.userId;
                }
                params.sortBy = this.query.sortBy;

                this.getEvents(params);
            },
            getEvents(params) {
                Api.getEvents(params).then(res => {
                    this.events = res.data;
                    this.slicedEvents = this.events.slice(0, this.eventsPerPage);
                    this.currentPage = 1;
                });
            },
            sortByAttendeesASC() {
                this.events.sort((a, b) => (a.numAcceptedAttendees > b.numAcceptedAttendees) ? 1 : -1);
            },
            handlePageChange() {
                this.slicedEvents = this.events.slice(this.eventsPerPage * (this.currentPage - 1), this.eventsPerPage + (this.eventsPerPage * (this.currentPage - 1)));
                window.scrollTo(0,0);
            },
            handleSizeChange(val) {
                this.eventsPerPage = val;
                this.slicedEvents = this.events.slice(this.eventsPerPage * (this.currentPage - 1), this.eventsPerPage + (this.eventsPerPage * (this.currentPage - 1)));
            }
        },
    }
</script>

