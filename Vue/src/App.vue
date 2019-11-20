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
export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
  let response = undefined;

  if (!importObject) {
    importObject = {
      env: {
        abort: () => console.log("Abort!")
      }
    };
  }

  // Check if the browser supports streaming instantiation
  if (WebAssembly.instantiateStreaming) {
    // Fetch the module, and instantiate it as it is downloading
    response = await WebAssembly.instantiateStreaming(
      fetch(wasmModuleUrl),
      importObject
    );
  } else {
    // Fallback to using fetch to download the entire module
    // And then instantiate the module
    const fetchAndInstantiateTask = async () => {
      const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
        response.arrayBuffer()
      );
      return WebAssembly.instantiate(wasmArrayBuffer, importObject);
    };
    response = await fetchAndInstantiateTask();
  }

  return response;
};

let mod = null;
wasmBrowserInstantiate("./test.wasm").then( (app) => mod = app);
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
      let start = performance.now();
      for(let i = 1; i < 100000; i++) {
        
      }
      let end = performance.now();
      this.nativeResult = (end - start).toString();
    },
    async assemLoop() {
            let start = performance.now();
      var r = mod.instance.exports.MillionLoop();
     let end = performance.now();
      this.assemResult = (end - start).toString();
      console.log(r)
    },
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
