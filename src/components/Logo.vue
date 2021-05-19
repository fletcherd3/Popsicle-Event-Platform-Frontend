<template>
    <div v-on:click="$router.push({ name: 'Home' })">
        <i class="el-icon-ice-cream-round" />
        Popsicle
    </div>
</template>

<script>
    export default {
        name: "Logo"
    }
</script>

<style scoped>

</style>