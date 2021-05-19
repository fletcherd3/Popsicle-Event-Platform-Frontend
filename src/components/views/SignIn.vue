<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <el-card shadow="always">
                    <el-form :model="form" ref="form">
                        <el-form-item
                                prop="email"
                                label="Email"
                                :rules="[
                                  { required: true, message: 'Please input an email address'},
                                  { type: 'email', message: 'Please input a correct email address' }
                                ]"
                        >
                            <el-input v-model="form.email"></el-input>
                        </el-form-item>
                        <el-form-item
                                prop="password"
                                label="Password"
                                :rules="[
                                  { required: true, message: 'Please input a password'}
                                ]"
                        >
                            <el-input type="password" autocomplete="off" v-model="form.password" show-password />
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" v-on:click="login">Sign In</el-button>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import {Api} from '../../Api';

    export default {
        name: 'SignIn',
        data() {
            return {
                form: {
                    email: '',
                    password: ''
                }
            };
        },
        props: {
            userId: Number
        },
        methods: {
            login() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        Api.login(this.form).then(res => {
                            const token = res.data.token;
                            const id = res.data.userId;
                            this.$emit("login", token, id);
                            this.$router.push({ name: 'Home' })
                        });

                    }
                });
            }
        }
    }
</script>

<style>

</style>
