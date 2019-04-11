<template>
    <div class="homeComponent">
        <div class="title">I'm The <span>home.vue</span> component</div>
    </div>
</template>

<script>
    export default {
        name: 'Home'
    }
</script>

<style lang="scss" scoped>
    .homeComponent {
        border: 2px dotted firebrick;
        padding: 10px;
        .title {
            span {
                color: darkolivegreen!important;
                font-size: 20px;
            }
        }
    }
</style>
