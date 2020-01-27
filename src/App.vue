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
    <input type="button" value='run Fib' @click="fib">
    <chart :chartID="fibName" 
      :jsData='jsFibOps'
      :wasmData='wasmFibOps'
      ref='chart'></chart>
  </div>
  <div class='container'>
    <input type="button" value='run Calc' @click="calcSqrSort">
    <chart :chartID="calcSort" 
      ref='chart2'></chart>
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

import Chart from './components/chart';
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
let mod = null;

loader.instantiateStreaming(fetch('./wasm/optimized.wasm'), importObj).then( (myModule) => {
    const { __allocString, __retain,  DemoStuff, __getString} = myModule;
    getString = __getString;
    mod = myModule;
    // manage the string memory and make space for it
    const instanceName = __retain(__allocString('My Assembly Class'));
    demoInstance = new DemoStuff(instanceName);
    demoInstance.setArray();
});


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
      fibFaster: '',
      
      modName: '',
      double: -1,
      randomArray: RandomArr(),

      jsCalcOps: '',
      wasmCalcOps: '',
      calcFaster: '',
      calcSort: 'sqrt&sort',

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

      function JS(){
        calcSqrtSort(this.randomArray.slice());
      }
   
      const wasm = () => {
        const arrayPtr = mod.__retain(mod.__allocArray(mod.F64ID , [...this.randomArray]) );
        demoInstance.calcSqrSort(arrayPtr);
        mod.__release(arrayPtr);
      }

      const setResult = (target) => {
        if(target.name === "JS"){
          this.jsCalcOps = target.hz;
        } else {
          this.wasmCalcOps = target.hz;
        }
      }

      const fasterBy = () => {
        this.$refs.chart2.chart.config.data.datasets[0].data = [this.wasmCalcOps, this.jsCalcOps]
        this.$refs.chart2.chart.update();
      }
   
      const suite = new Benchmark.Suite;
      suite.add('JS', JS.bind(this))
        .add('wasm', wasm.bind(this))
        .on('complete', fasterBy.bind(this))
        .on('cycle', function(e){
          setResult(e.target);
        }).run({ 'async': true });

    },

    fib() {
  
      function JS() {
        Fib(30);
      }
      const wasm = () => {
        demoInstance.fib(30);
      };

      const setResult = (target) => {
        if(target.name === "JS"){
          this.jsFibOps = target.hz;
        } else {
          this.wasmFibOps = target.hz;
        }
      }

      const fasterBy = () => {
        this.$refs.chart.chart.config.data.datasets[0].data = [this.wasmFibOps, this.jsFibOps]
          this.$refs.chart.chart.update();
      }

      const suite = new Benchmark.Suite;
      suite.add('JS', JS.bind(this))
        .add('wasm', wasm.bind(this))
        .on('complete', fasterBy.bind(this))
        .on('cycle', function(e){
          setResult(e.target);
          }).run({ 'async': true });
      
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
