
<template>
  <div id="app">
    <div>
      <input type="button" value="Print Mod Name" @click='getModName'>
      <div>{{ modName }}</div>
    </div>
    <div>
      <input type="button" value="Call JS from WASM" @click='multiply'>
          <div>{{ double }}</div>
    </div>
    <chart wasmPic="images/WASM-Fib.JPG" jsPic="images/JS-Fib.JPG" :chartID="FibChart" :btnEvent='CalcFib' :btnText='Fib' ref='chart'></chart>
    <chart wasmPic="images/WASM-CallPass.JPG" jsPic="images/JS-SumPass.JPG" :btnText='SumPassedText' :chartID="sumPassedChart" :btnEvent='SumPassed' ref='chart2'></chart>
    <chart wasmPic="images/WASM-SumStatic.JPG" jsPic="images/JS-SumStatic.JPG" :chartID="SumStaticChart" :btnText='SumStatic' :btnEvent='calcSum' ref='chart3'></chart>
  </div>
</template>

<style scoped>

</style>

<script>
import Vue from 'vue';
import Chart from './components/chart';
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
// Init plugin
Vue.use(Loading);
// eslint-disable-next-line no-unused-vars
import { Fib, LoopIt, RandomArr, calcSqrtSort, TimeToRun, BuildBenchmark, BuildResult } from './utils.js'
// eslint-disable-next-line no-unused-vars
import loader from '@assemblyscript/loader';
import Benchmark from 'benchmark';

const importObj = {
  env: {
    jsFunc(val) {
      return val * 2;
    },
    abort() {
      // eslint-disable-next-line no-console
      console.log("Abort!");
    }
  }
};

let demoInstance = null;
let mod = null;
/**
 * Load the WASM
 * Declare and instanciate the DemoStuff instance
 */
loader.instantiateStreaming(fetch('./wasm/optimized.wasm'), importObj).then( (myModule) => {
    const { DemoStuff } = myModule;
    mod = myModule;
    // manage the string memory and make space for it
    const instanceName = mod.__retain(mod.__allocString('My Assembly Class'));
    demoInstance = new DemoStuff(instanceName);
    demoInstance.setArray();
});
  const RandomArray = RandomArr();

/**
 * Sum a passed array
 */
  function JsSumPass(arr){
    arr.reduce((acc, current) => {
      return acc + current;
    });
  }

/**
 * Sum a passed array in WASM
 */
  function WasmSumPass(arr) {
    const arrayPtr = mod.__retain(mod.__allocArray(mod.F64ID , [...arr]) );
    demoInstance.sumArray(arrayPtr);
    mod.__release(arrayPtr);
  }


/**
 * Sum a static array
 */
  function JsSum(){
    RandomArray.reduce((acc, current) => {
      return acc + current;
    });
  }
/**
 * Sum a static array in wasm
 */
  function WASMSum() {
    demoInstance.callSum();
  }

  let loaderIndicator = {};
  function ShowLoading( ) {
        loaderIndicator.loader = this.$loading.show({
          loader: "dots",
          color: "#00cc00",
          height: 170,
          width: 190,
        });
}

export default {
  name: 'app',
  components: {
     Chart
  },

  data() {
    return {
      Fib: 'Calculate 30th Fibinoci',
      FibChart: 'chart1',
      
      modName: '',
      double: -1,

      SumPassedText: 'Sum Passed Array',
      sumPassedChart: 'chart2',

      SumStatic: 'Sum Static Array',
      SumStaticChart: 'chart3',
    }
  },
  methods: {
    getModName () {
      this.modName = mod.__getString(demoInstance.getName());
    },

    multiply() {
      this.double = demoInstance.callExternal(32);
    },

    SumPassed() {

      const result = BuildResult(this.$refs.chart2.chart, loaderIndicator);
      
      const suite = new Benchmark.Suite;
      BuildBenchmark(suite, JsSumPass.bind(this, RandomArray), WasmSumPass.bind(this, RandomArray), result.bind(this), ShowLoading.bind(this) );
      suite.run({async: true });
    },

    calcSum() {
   
      const result = BuildResult(this.$refs.chart3.chart, loaderIndicator);

      const suite = new Benchmark.Suite;
      BuildBenchmark(suite, JsSum.bind(this), WASMSum.bind(this), result.bind(this), ShowLoading.bind(this));
      suite.run({async: true });
    },


    CalcFib() {
  
      function JS() {
        Fib(30);
      }
      const wasm = () => {
        demoInstance.fib(30);
      };

      const result = BuildResult(this.$refs.chart.chart, loaderIndicator);

      const suite = new Benchmark.Suite;
      BuildBenchmark(suite, JS.bind(this), wasm.bind(this), result.bind(this), ShowLoading.bind(this));
      suite.run({async: true });
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
</style>
