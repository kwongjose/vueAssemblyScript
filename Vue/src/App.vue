<template>
  <div id="app">
    <loopCount 
    :btnText=nativeBtn
    @click=nativeLoop
    :result=nativeResult
    />
    <loopCount
      :btnText=assemBtn
      :result=assemResult
      @click=assemLoop
      />
  </div>
</template>

<script>
import LoopCount from "./componets/loopCount.vue"
export default {
  name: 'app',
  components: {
    LoopCount
  },
  data () {
    return {
      nativeBtn: "Native",
      nativeResult: "",
      assemBtn: "Assembly",
      assemResult: "",

    }
  },
  methods: {
    nativeLoop() {
      console.log("native");
      var start = performance.now();
      for(let i = 1; i < 100; i++) {

      }
      var end = performance.now();
      this.nativeResult = (end - start).toString();
    },
    assemLoop() {

    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
