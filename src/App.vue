/* eslint-disable no-console */
/* eslint-disable no-console */
/* eslint-disable no-console */
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
  <div class='container'>
    <input type="button" value='Calculate 30th Fib' @click="fib">
    <chart :chartID="fibName" 
      :jsData='jsFibOps'
      :wasmData='wasmFibOps'
      ref='chart'></chart>
  </div>
  <div class='container'>
    <input type="button" value='Sum Passed Array' @click="calcSqrSort">
    <chart :chartID="calcSort" 
      ref='chart2'></chart>
  </div>
    <div class='container'>
    <input type="button" value='Sum Static Array' @click="calcSum">
    <chart :chartID="calcSort2" 
      ref='chart3'></chart>
  </div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 40px;
  margin-bottom: 20px;
  width: 100%;
}
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
import { Fib, LoopIt, RandomArr, calcSqrtSort, TimeToRun } from './utils.js'
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
// function to dereference the string
let getString = null;
// eslint-disable-next-line no-unused-vars
let mod = null;

/**
 * Load the WASM
 * Declare and instanciate the DemoStuff instance
 */
loader.instantiateStreaming(fetch('./wasm/optimized.wasm'), importObj).then( (myModule) => {
    const { __allocString, __retain,  DemoStuff, __getString} = myModule;
    getString = __getString;
    mod = myModule;
    // manage the string memory and make space for it
    const instanceName = __retain(__allocString('My Assembly Class'));
    demoInstance = new DemoStuff(instanceName);
    demoInstance.setArray();
});
  const RandomArray = RandomArr();

/**
 * Sum a passed array
 */
  function JsSortCalc(arr){
    arr.reduce((acc, current) => {
      return acc + current;
    });
  }

/**
 * Sum a passed array in WASM
 */
  function WASMSortCalc(arr) {
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

  let loaderIndicator = null;
  function ShowLoading( ) {
        loaderIndicator = this.$loading.show({
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
      fibName: "fib",
      jsFibOps: 0,
      wasmFibOps: 0,
      
      modName: '',
      double: -1,

      jsCalcOps: 0,
      wasmCalcOps: 0,
      calcSort: 'sqrt&sort',

      jsSumOps: 0,
      wasmSumOps: 0,
      calcSort2: 'sqrt&sort2',

    }
  },
  methods: {
    getModName () {
      this.modName = getString(demoInstance.getName());
    },

    multiply() {
      this.double = demoInstance.callExternal(32);
    },

    calcSqrSort() {

      const setResult = (e) => {
        const target = e.target;
        if(target.name === "JS"){
          this.jsCalcOps = target.hz;
        } else {
          this.wasmCalcOps = target.hz;
        }
      }

      const fasterBy = () => {
        this.$refs.chart2.chart.config.data.datasets[0].data = [ this.wasmCalcOps, this.jsCalcOps ]
        this.$refs.chart2.chart.update();
        loaderIndicator.hide();
      }
      

      const suite = new Benchmark.Suite;
      suite.add('JS', JsSortCalc.bind(this, RandomArray))
        .add('wasm', WASMSortCalc.bind(this, RandomArray))
        .on('complete', fasterBy.bind(this))
        .on('cycle', setResult.bind(this))
        .on('start', ShowLoading.bind(this) )
        .run({ 'async': true });

    },

    calcSum() {

      const setResult = (e) => {
        const target = e.target;
        if(target.name === "JS"){
          this.jsSumOps = target.hz;
        } else {
          this.wasmSumOps = target.hz;
        }
      }

      const fasterBy = () => {
        this.$refs.chart3.chart.config.data.datasets[0].data = [this.wasmSumOps, this.jsSumOps]
        this.$refs.chart3.chart.update();
        loaderIndicator.hide();
      }
   
      const suite = new Benchmark.Suite;
      suite.add('JS', JsSum.bind(this))
        .add('wasm', WASMSum.bind(this))
        .on('complete', fasterBy.bind(this))
        .on('cycle', setResult.bind(this))
        .on('start', ShowLoading.bind(this) )
        .run({ 'async': true });

    },


    fib() {
  
      function JS() {
        Fib(30);
      }
      const wasm = () => {
        demoInstance.fib(30);
      };

      const setResult = (e) => {
        const target = e.target;
        if(target.name === "JS"){
          this.jsFibOps = target.hz;
        } else {
          this.wasmFibOps = target.hz;
        }
      }

      const fasterBy = () => {
        this.$refs.chart.chart.config.data.datasets[0].data = [this.wasmFibOps, this.jsFibOps]
        this.$refs.chart.chart.update();
        loaderIndicator.hide();
      }

      const suite = new Benchmark.Suite;
      suite.add('JS', JS.bind(this))
        .add('wasm', wasm.bind(this))
        .on('complete', fasterBy.bind(this))
        .on('cycle', setResult.bind(this))
        .on('start', ShowLoading.bind(this) )
        .run({ 'async': true });
      
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
