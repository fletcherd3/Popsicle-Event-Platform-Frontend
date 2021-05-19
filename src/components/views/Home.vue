<template>
    <div class="hello">
        <h1>Home</h1>
        user id {{$props}}
    </div>
</template>

<script>
    export default {
        name: 'Home',
        props: {
            userId: Number
        }
    }
</script>

