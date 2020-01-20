/* eslint-disable no-console */
/* eslint-disable no-console */
/* eslint-disable no-console */
<template>
  <div id="app">
    <table>
      <tbody>
        <tr>
          <td>Name</td>
          <td>JavaScript result</td>
          <td> JavaScript Time</td>
          <td>WASM result</td>
          <td>WASM Time</td>
        </tr>
        <tableRow
          :name='fibName'
          :jsResult='jsFibResult'
          :jsTime='jsFibTime'
          :wasmResult='wasmFibResult'
          :wasmTime='wasmFibTime'
          :runFuncs='fib'></tableRow>
        <tableRow
          :name="calcSort"
          :jsResult='blank'
          :jsTime='jscalTime'
          :wasmResult='blank'
          :wasmTime='wasmCalTime'
          :runFuncs='calcSqrSort'></tableRow>
      </tbody>
    </table>
  <div>
    <input type="button" value="Print Mod Name" @click='getModName'>
    <div>{{ modName }}</div>
  </div>
  <div>
    <input type="button" value="double 32" @click='multiply'>
        <div>{{ double }}</div>
  </div>
  </div>
</template>

<style scoped>
table {
  width: 100%
}
</style>

<script>
import TableRow from './components/TableRow.vue';
import { Fib, LoopIt, RandomArr, calcSqrtSort, TimeToRun } from './utils.ts'

import loader from '@assemblyscript/loader';
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
loader.instantiate( fetch('./optimized.wasm'), importObj).then( (myModule) => {

    const { __allocString, __retain,  DemoStuff, __getString } = myModule;
    getString = __getString;
    // manage the string memor and make space for it
    const instanceName = __retain(__allocString('My Assembly Class'));
    demoInstance = new DemoStuff(instanceName);
});

export default {
  name: 'app',
  components: {
    TableRow
  },

  data() {
    return {
      fibName: "fib",
      jsFibTime: -1,
      jsFibResult: -1,
      wasmFibTime: -1,
      wasmFibResult: -1,
      modName: '',
      double: -1,
      randomArray: RandomArr(),
      jscalTime: -1,
      wasmCalTime: -1,
      blank: -1,
      calcSort: 'sqrt & sort'
    }
  },
  methods: {
    fib() {
      let result = TimeToRun(() => LoopIt(Fib, 10, 30));
      this.jsFibTime = result.time;
      this.jsFibResult = result.result;

      result = TimeToRun(() => LoopIt((v) => demoInstance.fib(v), 10, 30));
      this.wasmFibTime = result.time;
      this.wasmFibResult = result.result;

      
    },

    getModName () {
      this.modName = getString(demoInstance.getName());
    },

    multiply() {
      // eslint-disable-next-line no-console
      this.double = demoInstance.callExternal(32);
    },

    calcSqrSort() {
      let start = performance.now();
      calcSqrtSort(this.randomArray.slice());
      let end = performance.now();
      this.jscalTime = end - start;

      start = performance.now();
      demoInstance.calcSqrSort(this.randomArray.slice());
      end = performance.now();
      this.wasmCalTime = end - start;
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
