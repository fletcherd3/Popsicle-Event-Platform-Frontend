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
                                        prop="dateTime"
                                        class="col-sm-6 w-100"
                                >
                                    <el-date-picker
                                            class="w-100"
                                            v-model="form.dateTime"
                                            type="datetime"
                                            format="DD/MM/YYYY h:mm a"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item
                                        class="col-sm-6 w-100"
                                        label="Categories"
                                        prop="categoryIds"
                                >
                                    <el-cascader
                                            class="w-100"
                                            v-model="form.categoryIds"
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
                                                     :step="0.1"></el-input-number>
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
                                <el-form-item class="col-sm-9 w-100" label="Link" prop="link">
                                    <el-input class="w-100" v-model="form.link"
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
                            <el-tooltip effect="dark" content="Have the ability to accept and reject attendees" placement="right">
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
                                <el-input class="w-100" type="textarea" v-model="form.description" maxlength="2048" show-word-limit/>
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
                                    v-if="imageUrl" :src="imageUrl"
                                    fit="cover">
                            </el-image>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <el-button type="primary" v-on:click="finish">{{imageBtnText}}</el-button>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import {Api} from '../../Api';
    import {options} from '../../categoriesMap';
    const moment = require('moment');

    export default {
        name: 'CreateEvent',
        data() {
            const validateLink = (rule, value, callback) => {
                if ((!this.form.isOnline && value === '') || (value && (value.startsWith('http://') || value.startsWith('https://')))) {
                    this.$refs.form.validateField('link');
                    callback();
                } else {
                    callback(new Error('Link must start with http:// or https://'));
                }
            };
            const validateDateTime = (rule, value, callback) => {
                const today = new Date();
                value = Date.parse(value);
                if (today - value > 0) {
                    callback(new Error("An event can't be in the past"));
                } else {
                    this.$refs.form.validateField('dateTime');
                    callback();
                }
            };
            const validateVenue = (rule, value, callback) => {
                if (!this.form.isOnline && value === '') {
                    callback(new Error("An in person event must have a venue"));
                } else {
                    this.$refs.form.validateField('dateTime');
                    callback();
                }
            };

            return {
                onDetails: true,
                options: options,
                form: {
                    title: '',
                    description: '',
                    categoryIds: [],
                    dateTime: null,
                    isOnline: false,
                    fee: 0,
                    capacity: 1,
                    venue: '',
                    requiresAttendanceControl: false,
                    link: ''
                },
                rules: {
                    link: [
                        {validator: validateLink, trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: 'An event must have a title'}
                    ],
                    categoryIds: [
                        {required: true, message: 'An event must be in at least one category'}
                    ],
                    dateTime: [
                        {required: true, message: 'An event must have a date/time'},
                        {validator: validateDateTime, trigger: 'blur'}
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
                eventId: null,
                imageUrl: '',
                imageBtnText: 'Skip'
            };
        },
        methods: {
            next() {
                // Format the categories and the date/time

                this.form.date = moment(Date.parse(this.form.dateTime)).format('YYYY-MM-DD HH:MM:SS');
                this.form.url = this.form.link;

                this.$refs['form'].validate((valid) => {
                    let createErr = false;
                    if (valid) {
                        this.form.categoryIds = this.form.categoryIds.map(el => parseInt(el[0], 10));
                        Api.createEvent(this.form).catch(error => {
                            createErr = true;
                            if (error.response.status === 400) {
                                this.$message.error('Oops, check your values and try again');
                            } if (error.response.status === 401) {
                                this.$message.error("Oops, look like you aren't signed in");
                            } else {
                                this.$message.error('Oops, an error has occurred!');
                            }
                        }).then(res => {
                            if (!createErr) {
                                // Go to the next page
                                this.onDetails = false;

                                this.eventId = res.data.eventId;
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
                })
            },
            finish() {
                this.$router.push({name: 'Events'})
            }
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
