
function Fib(number) {
    if(number <= 1) {
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
    let randomArr = [];
    for(let i = 0; i < 500; i++){
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
    return arr.filter((val) => val % 2 === 0);
  }

  function TimeToRun(cb) {
    let start = performance.now();
    const result = cb();
    let end = performance.now();
    return { time: end - start, result }
  }

  export { Fib, LoopIt, RandomArr, calcSqrtSort, TimeToRun }
