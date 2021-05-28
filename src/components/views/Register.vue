<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <el-card shadow="always">
                    <logo :text="false" class="logo w-100"/>
                    <div v-if="onDetails">
                        <el-form :model="form" ref="form" :rules="rules">
                            <div class="row justify-content-center">
                                <el-form-item
                                        prop="firstName"
                                        class="col-sm-6 w-100"
                                        label="First Name"
                                >
                                    <el-input v-model="form.firstName"></el-input>
                                </el-form-item>
                                <el-form-item
                                        prop="lastName"
                                        class="col-sm-6 w-100"
                                        label="Surname"
                                >
                                    <el-input v-model="form.lastName" />
                                </el-form-item>
                            </div>

                            <el-form-item
                                    label="Email"
                                    prop="email"
                            >
                                <el-input v-model="form.email"></el-input>
                            </el-form-item>
                            <el-form-item
                                    label="Password"
                                    prop="password"
                            >
                                <el-input type="password" autocomplete="off" v-model="form.password" show-password></el-input>
                            </el-form-item>
                        </el-form>
                        <el-button v-on:click="next">Next</el-button>
                    </div>
                    <div v-else>
                        Optionally add an avatar
                        <el-upload
                                action="/"
                                class="avatar-uploader my-3"
                                :http-request="uploadImage"
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
    import Logo from '../Logo';

    export default {
        name: 'Register',
        components: {
            Logo
        },
        data() {
            const validatePassword = (rule, value, callback) => {
                if (value.length < 8) {
                    callback(new Error('Password should be at least 8 characters'));
                } else {
                    this.$refs.form.validateField('password');
                    callback();
                }
            };
            return {
                onDetails: true,
                form: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: ''
                },
                rules: {
                    password: [
                        { required: true, message: 'Please input a password'},
                        { validator: validatePassword, trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: 'Please input an email address'},
                        { type: 'email', message: 'Please input a correct email address' }
                    ],
                    firstName: [
                        { required: true, message: 'Please input a first name'}
                    ],
                    lastName: [
                        { required: true, message: 'Please input a surname'}
                    ]
                },
                imageUrl: '',
                imageBtnText: 'Skip',
                user: {
                    token: '',
                    id: null
                }
            };
        },
        methods: {
            next() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let regError = false;
                        Api.register(this.form).catch(error => {
                            regError = true;
                            if (error.response.status === 400) {
                                this.$message.error('Oops, that email already exists');
                            } else {
                                this.$message.error('Oops, an error has occurred!');
                            }
                        }).then(() => {
                            if (!regError) {
                                Api.login(this.form).then(loginRes => {
                                    this.onDetails = false;
                                    const token = loginRes.data.token;
                                    const id = loginRes.data.userId;
                                    this.user.token = token;
                                    this.user.id = id;
                                    this.$emit("login", this.user.token, this.user.id);
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
                    this.imageBtnText = 'Upload';
                }

                return validType && isLt2M;
            },
            uploadImage(file) {
                Api.uploadAvatar(file, this.user.id).catch(() => {
                    this.$message.error('Oops, an error has occurred!');
                })
            },
            finish() {
                this.$router.push({ name: 'Profile' })
            }
        }
    }
</script>

<style >
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        height: auto;
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
    .logo {
        font-size: 5em;
    }
</style>
