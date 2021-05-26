<template>
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
        <a class="navbar-brand" v-on:click="$router.push({ name: 'Home' })" href="javascript:void(0);"><Logo/></a>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item" :class="{ active: $route.name === 'Events' }">
                    <a class="nav-link" v-on:click="$router.push({ name: 'Events' })" href="javascript:void(0);">Find Events</a>
                </li>
                <li v-if="isAuthenticated" class="nav-item" :class="{ active: $route.name === 'Create Event' }">
                    <a class="nav-link" v-on:click="$router.push({ name: 'Create Event' })" href="javascript:void(0);">Create Event</a>
                </li>
            </ul>
            <form  class="form-inline my-lg-0 navbar-nav">
                <div v-if="isAuthenticated">
                    <el-button class="my-1 my-lg-0 mx-auto mx-lg-1" round v-on:click="logout">Logout</el-button>
                </div>
                <div v-else>
                    <el-button class="my-1 my-lg-0 mx-auto mx-sm-1" type="primary" round v-on:click="$router.push({ name: 'Sign In' })">Sign In</el-button>
                    <el-button class="my-1 my-lg-0 mx-auto mx-sm-1" round v-on:click="$router.push({ name: 'Register' })">Register</el-button>
                </div>
            </form>
        </div>
    </nav>
</template>


<script>
    import Logo from "./Logo";

    export default {
        name: "NavBar",
        components: {
            Logo
        },
        props: {
            isAuthenticated: Boolean
        },
        methods: {
            logout() {
                this.$emit("logout");
                this.$router.push({ name: 'Home' })
            }
        }
    }
</script>

<style scoped>
    .navbar-toggler {
        border: none;
    }

</style>