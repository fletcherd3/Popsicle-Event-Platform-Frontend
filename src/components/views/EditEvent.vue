<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-9">
                <el-card shadow="always">
                    <div v-if="onDetails">
                        <h3>Tell us about your big day 😀</h3>
                        <el-form :model="form" ref="form" :rules="rules">
                            <el-form-item
                                    label="Title"
                                    prop="title"
                                    class="w-100"
                            >
                                <el-input v-model="form.title" maxlength="128" show-word-limit/>
                            </el-form-item>
                            <div class="d-flex flex-wrap align-items-center p-0">
                                <el-form-item
                                        label="Date & Time"
                                        prop="date"
                                        class="col-sm-6 w-100"
                                >
                                    <el-date-picker
                                            class="w-100"
                                            v-model="form.date"
                                            type="datetime"
                                            format="DD/MM/YYYY h:mm a"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item
                                        class="col-sm-6 w-100"
                                        label="Categories"
                                        prop="categories"
                                >
                                    <el-cascader
                                            class="w-100"
                                            v-model="form.categories"
                                            :options="options"
                                            :props="{ multiple: true }"
                                            clearable>
                                    </el-cascader>
                                </el-form-item>
                                <el-form-item
                                        class="col-sm-6 w-100"
                                        label="Max Attendees"
                                        prop="capacity"
                                >
                                    <el-input-number class="w-100" v-model="form.capacity" :min="1"/>
                                </el-form-item>
                                <el-form-item
                                        class="col-sm-6 w-100"
                                        label="Fee ($)"
                                        prop="fee"
                                >
                                    <el-input-number class="w-100" v-model="form.fee" :min="0" :precision="2"
                                                     :step="0.1"/>
                                </el-form-item>
                            </div>
                            <div class="d-flex flex-wrap align-items-center">
                                <el-form-item
                                        label="Online"
                                        prop="isOnline"
                                        class="col-sm-3 w-100"
                                >
                                    <el-switch class="w-100" v-model="form.isOnline"></el-switch>
                                </el-form-item>
                                <el-form-item class="col-sm-9 w-100" label="Link" prop="url">
                                    <el-input class="w-100" v-model="form.url" :disabled="!form.isOnline"
                                              placeholder="https://"></el-input>
                                </el-form-item>
                                <el-form-item
                                        label="Venue"
                                        prop="venue"
                                        class="col-sm-9 w-100 ml-auto"
                                >
                                    <el-input v-model="form.venue" :disabled="form.isOnline"></el-input>
                                </el-form-item>
                            </div>
                            <el-tooltip effect="dark" content="Have the ability to accept and reject attendees"
                                        placement="right">
                                <el-form-item
                                        label="Attendance Control"
                                        prop="requiresAttendanceControl"
                                        class="col-sm-5 w-100"
                                >
                                    <el-switch class="w-100" v-model="form.requiresAttendanceControl"/>
                                </el-form-item>
                            </el-tooltip>
                            <el-form-item
                                    label="Description"
                                    prop="description"
                            >
                                <el-input class="w-100" type="textarea" v-model="form.description" maxlength="2048"
                                          show-word-limit/>
                            </el-form-item>
                        </el-form>
                        <el-button v-on:click="next">Next</el-button>
                    </div>
                    <div v-else>
                        Optionally add an image
                        <el-upload
                                action="/"
                                class="avatar-uploader my-3"
                                :http-request="uploadEventImage"
                                :show-file-list="false"
                                :before-upload="handleImage"
                        >
                            <el-image
                                    class="avatar"
                                    :src="getImage()"
                                    onerror="javascript:this.src='https://www.weahsn.net/wp-content/themes/reticulum/images/event-default-small.jpg'"
                                    fit="cover">
                            </el-image>
                        </el-upload>
                        <el-button type="primary" v-on:click="finish">{{imageBtnText}}</el-button>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import {Api, SERVER_URL} from '../../Api';
    import {options} from '../../categoriesMap';

    const moment = require('moment');

    export default {
        name: 'EditEvent',
        data() {
            const validateLink = (rule, value, callback) => {
                if (!this.form.isOnline || (value && (value.startsWith('http://') || value.startsWith('https://')))) {
                    this.$refs.form.validateField('url');
                    callback();
                } else {
                    callback(new Error('Link must start with http:// or https://'));
                }
            };
            const validateDate = (rule, value, callback) => {
                const today = new Date();
                value = Date.parse(value);
                if (today - value > 0) {
                    callback(new Error("An event can't be in the past"));
                } else {
                    this.$refs.form.validateField('date');
                    callback();
                }
            };
            const validateVenue = (rule, value, callback) => {
                if (!this.form.isOnline && value === '') {
                    callback(new Error("An in person event must have a venue"));
                } else {
                    this.$refs.form.validateField('date');
                    callback();
                }
            };
            return {
                onDetails: true,
                options: options,
                form: {
                    title: '',
                    description: '',
                    categories: [],
                    date: null,
                    isOnline: false,
                    fee: 1,
                    capacity: 1,
                    venue: '',
                    requiresAttendanceControl: false,
                    organizerId: null,
                    url: ''
                },
                rules: {
                    url: [
                        {validator: validateLink, trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: 'An event must have a title'}
                    ],
                    categories: [
                        {required: true, message: 'An event must be in at least one category'}
                    ],
                    date: [
                        {required: true, message: 'An event must have a date/time'},
                        {validator: validateDate, trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: 'An event must have a description'}
                    ],
                    venue: [
                        {validator: validateVenue, trigger: 'blur'}
                    ],
                    fee: [
                        {required: true, message: 'An event must have a fee'},
                    ],
                },
                imageUrl: '',
                imageBtnText: 'Skip'
            };
        },
        props: {
            eventId: Number,
            userId: Number
        },
        methods: {
            next() {
                // Format the categories and the date/time
                this.form.categoryIds = this.form.categories.map(el => parseInt(el[0], 10));
                this.form.date = moment(Date.parse(this.form.date)).format('YYYY-MM-DD HH:mm:SS');
                if (!this.form.capacity) {
                    this.form.capacity = undefined;
                }

                this.$refs['form'].validate((valid) => {
                    let editErr = false;
                    if (!this.form.url) this.form.url = '';
                    if (valid) {
                        Api.editEvent(this.form, this.$props.eventId).catch(error => {
                            editErr = true;
                            if (error.response.status === 400) {
                                this.$message.error('Oops, check your values and try again');
                            } else if (error.response.status === 401) {
                                this.$message.error("Oops, look like you aren't signed in");
                            } else if (error.response.status === 403) {
                                this.$message.error("You can only edit your own events");
                            } else if (error.response.status === 404) {
                                this.$message.error("That event doesn't exist");
                            } else {
                                this.$message.error('Oops, an error has occurred!');
                            }
                        }).then(() => {
                            if (!editErr) {
                                // Go to the next page
                                this.onDetails = false;
                            }
                        });
                    }
                });
            },
            handleImage(file) {
                const validType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isLt2M) {
                    this.$message.error('Event image size can not exceed 2 MB');
                } else if (!validType) {
                    this.$message.error('Event image must be a JPG, PNG or GIF');
                } else {
                    this.imageUrl = URL.createObjectURL(file);
                    this.imageBtnText = 'Upload';
                }

                return validType && isLt2M;
            },
            uploadEventImage(file) {
                Api.uploadEventImage(file, this.eventId).catch(() => {
                    this.$message.error('Oops, an error has occurred!');
                }).then(() => {this.imageBtnText = 'Upload'});
            },
            finish() {
                this.$router.push({name: 'Event Details', params: {eventId: this.$props.eventId}});
            },
            isAuthenticated() {
                return this.form.organizerId === this.$props.userId;
            },
            async getEvent(eventId) {
                Api.getEvent(eventId).then(res => {
                    this.form = res.data;
                    this.form.isOnline = this.form.isOnline ? true : false;
                    this.form.requiresAttendanceControl = this.form.requiresAttendanceControl ? true : false;
                    this.form.fee = parseFloat(this.form.fee);
                    this.form.categories = [];

                    if (!this.isAuthenticated()) {
                        this.finish();
                    }
                });
            },
            getImage() {
                return this.imageUrl ? this.imageUrl : SERVER_URL + "/events/" + this.$props.eventId + "/image";
            },
        },
        async mounted() {
            await this.getEvent(this.$props.eventId);
        }
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        height: auto !important;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        margin-top: 75px;
        margin-bottom: 75px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

</style>
