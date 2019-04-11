
<template>
    <div id="app">
        <div class="title">I'm <span>app.vue</span></div>
        <Home class="wrapped"/>
        <div class="databind">
            <h1>
                {{ something }}
            </h1>
        </div>
    </div>
</template>

<script>
    import Home from './Home.vue'
    export default {
        name: 'App',
        components: { Home },
        data() {
            return {
                something: 'Another thing'
            }
        }
    }
</script>

<style lang="scss">
  #app {
    border: 2px dashed rebeccapurple;
    padding: 10px;
    .title {
      color:rgb(51, 116, 153);
      span {
        color: aqua;
        font-weight: bolder;
        text-decoration: underline;
        font-style: italic;
      }
    }
    .wrapped {
      margin: 10px;
    }
    .databind {
      h1 {
        font-weight: bold;
      }
    }
  }
</style>
