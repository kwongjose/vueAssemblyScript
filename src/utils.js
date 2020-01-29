
function Fib(number) {
    if(number === 1 || number == 2) {
      return 1;
    } 
    return Fib(number - 1) + Fib(number - 2);
  }
  
  function LoopIt(cb, itr, args) {
    let result = null;
    for(let i = 0; i < itr; i++){
      result = cb(args)
    }
    return result;
  }
  
  function RandomArr(){
    let randomArr = new Float64Array(10000);
    for(let i = 0; i < 10000; i++){
      randomArr[i] = (Math.random() * 1000) + 1;
    }
    return randomArr;
  }
  
  function calcSqrtSort(arr) {

    for(let i = 0; i < arr.length; i++){
      arr[i] = Math.sqrt(arr[i]);
    }
  
    for(let i = 0; i < arr.length; i++){
      for(let t = i + 1; t < arr.length; t++){
        if(arr[i] > arr[t]){
          // swap
          let u = arr[i];
          arr[i] = arr[t];
          arr[t] = u;
        }
      }
    }
  }

  function TimeToRun(cb) {
    let start = performance.now();
    const result = cb();
    let end = performance.now();
    return { time: end - start, result }
  }

  function BuildBenchmark(suite, jsFunc, wasmFunc, complete,  start){
   suite.add('wasm', wasmFunc)
    .add('JS', jsFunc)
    .on('complete', complete)
    .on('start', start)
  }

  function BuildResult(chart, loader) {
    return (e) => {
      let data = [];
      e.currentTarget.forEach((item) => {
        data.push(item.hz);
      });

      chart.config.data.datasets[0].data = data;
      chart.update();
      loader.loader.hide();
    };
  }


  export { BuildResult, BuildBenchmark, Fib, LoopIt, RandomArr, calcSqrtSort, TimeToRun }
