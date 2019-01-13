
<template>
    <div id="app">

        <div class="title">HELLO</div>
        <Home/>
        <div class="nem">
            {{derp}}
        </div>
        <button v-on:click="changeNem()">change </button>
        <div v-for="album in albums" v-bind:key="album.id"> 
            <h1>
                {{album.title}}
            </h1>
            <img :src="album.url"/>
        </div>
    </div>
</template>

<script>
    import Home from './Home.vue'
    export default {
        data() {
            return {
                derp: 'je suis un homme',
                albums: []
            }
        },
        methods: {
            changeNem() {
                this.derp = 'antoine'
                console.log("pass")
            },
            getData() {
                fetch("https://jsonplaceholder.typicode.com/photos").then(data => 
                    data.json()
                ).then((json) => {
                    console.log(json)
                    this.albums=json.slice(0,20)
                })
            }
        },
        created() {
            this.getData()
        },
        components: {Home}
    }
</script>

<style scoped> 
    .title {
        color:rebeccapurple;
    }
    .nem {
        font-weight: bold;
    }
</style>