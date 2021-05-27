<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <el-card shadow="always" class="profile-card">
                    <el-avatar class='profile' fit='cover' :size="200" :src="getAvatar()"
                               icon="el-icon-user-solid"/>
                    <div class="info">
                        <div class="row w-100">
                            <el-button class="ml-auto" type="primary" icon="el-icon-edit" circle></el-button>
                        </div>

                        <div class="mt-2">
                            <h2>{{user.firstName}} {{user.lastName}}</h2>
                            <i class="el-icon-message mr-2" />
                            <a :href="`mailto:${user.email}`">{{user.email}}</a>
                        </div>

                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import {SERVER_URL, Api} from '../../Api';

    export default {
        name: 'UserProfile',
        data() {
            return {
                user: {
                    firstName: '',
                    lastName: '',
                    email: ''
                }
            };
        },
        props: {
            userId: Number
        },
        methods: {
            getAvatar() {
                return SERVER_URL + "/users/" + this.$props.userId + "/image";
            },
            getUser() {
                Api.getUser(this.$props.userId).catch((err) => {
                    if (err) {
                        this.$message.error('An error occurred when trying get users details');
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        this.user = res.data;
                    }
                })
            }
        },
        mounted() {
            this.getUser();
        }
    }

</script>

<style scoped>
    .profile-card {
        margin-top: 100px;
    }

    .profile {
        font-size: 7em;
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        top: 0;
    }

    .info {
        margin-top: 37px;
        text-align: center;
    }
</style>
