<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <el-card shadow="always" class="profile-card justify-context-center">
                    <el-form :model="form" ref="form" :rules="rules">
                        <el-upload
                                action="/"
                                class="profile avatar-uploader"
                                :http-request="uploadImage"
                                :show-file-list="false"
                                :before-upload="handleImage"
                        >
                            <el-avatar class='avatar-icon' fit='cover' :size="200" :src="imageUrl"
                                       icon="el-icon-user-solid"/>
                        </el-upload>
                        <el-button class="delete-btn" v-on:click="deleteAvatar" type="danger" icon="el-icon-delete"
                                   circle/>

                        <div class="info">
                            <div class="row w-100 mr-0 ml-0">
                                <el-button v-on:click="$router.push({ name: 'Profile'})" icon="el-icon-arrow-left"
                                           circle/>
                                <el-button class="ml-auto" v-on:click="editUser" type="success" icon="el-icon-check"
                                           circle/>
                            </div>

                            <div class="mt-2">
                                <div class="d-flex flex-wrap">
                                    <el-form-item
                                            class="col-md-6"
                                            prop="firstName"
                                            label="First Name"
                                    >
                                        <el-input v-model="form.firstName"></el-input>
                                    </el-form-item>
                                    <el-form-item
                                            class="col-md-6"
                                            prop="lastName"
                                            label="Surname"
                                    >
                                        <el-input v-model="form.lastName"></el-input>
                                    </el-form-item>
                                    <el-form-item
                                            class="col-12"
                                            prop="email"
                                            label="Email"
                                    >
                                        <el-input v-model="form.email"></el-input>
                                    </el-form-item>
                                    <el-form-item
                                            class="col-12"
                                            prop="currentPassword"
                                            label="Current Password"
                                            :rules="[
                                            ]"
                                    >
                                        <el-input type="password" autocomplete="off" v-model="form.currentPassword"
                                                  show-password/>
                                    </el-form-item>
                                    <el-form-item
                                            class="col-12"
                                            prop="password"
                                            label="New Password"
                                            :rules="[
                                            ]"
                                    >
                                        <el-input type="password" autocomplete="off" v-model="form.password"
                                                  show-password/>
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import {Api, SERVER_URL} from '../../Api';

    export default {
        name: 'EditUserProfile',
        data() {
            return {
                rules: {
                    firstName: [
                        {required: true, message: 'A user must have a last name'}
                    ],
                    lastName: [
                        {required: true, message: 'A user must have a first name'}
                    ],
                    email: [
                        {required: true, message: 'A user must have an email'},
                        {type: 'email', message: 'Please input a correct email address'}
                    ]
                },
                form: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    currentPassword: '',
                    password: ''
                },
                imageUrl: SERVER_URL + "/users/" + this.$props.userId + "/image"
            };
        },
        props: {
            userId: Number
        },
        methods: {
            getUser() {
                Api.getUser(this.$props.userId).catch((err) => {
                    if (err) {
                        this.$message.error('An error occurred when trying get users details');
                        this.$router.push({name: 'Events'});
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        this.form = res.data;
                    }
                });
            },
            editUser() {
                this.form.password = this.form.password ? this.form.password : undefined;
                this.form.currentPassword = this.form.currentPassword ? this.form.currentPassword : undefined;

                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        Api.editUser(this.form, this.$props.userId).catch(error => {
                            if (error.response.status === 400) {
                                this.$message.error('Oops! That email might already exist or your current password is a bit off');
                            } else if (error.response.status === 401) {
                                this.$message.error("Oops, look like you don't have access to do this");
                            } else if (error.response.status === 403) {
                                this.$message.error("You can only edit your own profile");
                            } else {
                                this.$message.error('Oops, an error has occurred!');
                            }
                        }).then((res) => {
                            if (res.status === 200) {
                                this.$message({
                                    message: 'Saved new user details',
                                    type: 'success'
                                });
                            }
                        });
                    }
                });
            },
            handleImage(file) {
                const validType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isLt2M) {
                    this.$message.error('Avatar picture size can not exceed 2 MB');
                } else if (!validType) {
                    this.$message.error('Avatar picture must be a JPG, PNG or GIF');
                } else {
                    this.imageUrl = URL.createObjectURL(file);
                }

                return validType && isLt2M;
            },
            uploadImage(file) {
                Api.uploadAvatar(file, this.$props.userId).catch(() => {
                    this.$message.error('Oops, an error has occurred when uploading your image!');
                }).then((res) => {
                    if (res.status === 200) {
                        this.$message({
                            message: 'Image saved',
                            type: 'success'
                        });
                    }
                })
            },
            deleteAvatar() {
                Api.deleteAvatar(this.$props.userId).catch((err) => {
                    if (err) {
                        this.$message({
                            message: 'You must have an avatar to delete it',
                            type: 'warning'
                        });
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        this.imageUrl = '';
                        this.$message({
                            message: 'Deleted avatar',
                            type: 'success'
                        });
                    }
                });
            }
        },
        mounted() {
            this.getUser();
        }
    }

</script>

<style>
    .profile-card {
        margin-top: 100px;
    }

    .profile {
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
        left: 0;
        right: 0;
        top: 0;
    }

    .info {
        margin-top: 37px;
        text-align: center;
    }

    .avatar-icon {
        width: 178px;
        height: 178px;
        font-size: 7em !important;
    }

    .delete-btn {
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        left: 337px;
        right: 0;
    }

    .avatar-uploader .el-upload {
        height: 203px;
    }

</style>

