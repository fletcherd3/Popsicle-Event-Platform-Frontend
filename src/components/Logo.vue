<template>
    <a class="navbar-brand" href="javascript:void(0);" v-on:click="$router.push({ name: 'Home' })">
        <i class="el-icon-ice-cream-round" />
        <span v-if="$props.text">Popsicle</span>

    </a>
</template>

<script>
    export default {
        name: "Logo",
        props: {
            text: Boolean
        }
    }
</script>

<style scoped>

</style>