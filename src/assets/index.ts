// The entry file of your WebAssembly module.
@external('env', 'jsFunc')
declare function jsFunc(val: i32): i32;

export class DemoStuff {

private myName: string;
constructor(private name: string ) {
  this.myName = name;
}

getName (): string {
  return this.myName;
}

// Returns Nth Fibonacci 
fib(n: i32): i32 {
  if(n <= 1) {
    return 1
  }
  return this.fib(n - 1) + this.fib(n - 2); 
}

// calls a JS function
callExternal(val: i32): i32 {
  return jsFunc(val);
}

calcSqrSort(arr: Array<f64>): Array<f64> {
  for(let i = 0; i < arr.length; i++) {
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

  return arr;
}

}