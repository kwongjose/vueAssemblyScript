// The entry file of your WebAssembly module.
@external('env', 'jsFunc')
declare function jsFunc(val: i32): i32;
// The runtime ID of the array type
export const F64ID = idof<Float64Array>();
// Need to see Native math to use Random
NativeMath.seedRandom(Date.now());
const Arr = new Float64Array(10000);

export class DemoStuff {

private myName: string;
constructor(private name: string ) {
  this.myName = name;

}

getName (): string {
  return this.myName;
}

setArray(): void {
  for(let i = 0; i < 10000; i++) {
    Arr[i] = (Math.random() * 1000) + 1;
  }
}


fib(n: i32): i32 {
  if(n == 1) {
    return 1
  }
  if(n == 2) {
    return 1
  }
  return this.fib(n - 1) + this.fib(n - 2); 
}

// calls a JS function
callExternal(val: i32): i32 {
  return jsFunc(val);
}

sumArray(arr: Float64Array): void {
  arr.reduce<f64>( (x: f64, current: f64): f64 => {
    return x + current;
  }, 0);
}

callSum(): void {
  Arr.reduce<f64>( (x: f64, current: f64): f64 => {
    return x + current;
  }, 0);
}


calcSqrSort(arr: Float64Array): void {
  for(let i = 0; i < arr.length; i++) {
    arr[i] = Math.sqrt(arr[i]);
  }

  for(let i = 0; i < arr.length; i++){
    for(let t = i + 1; t < arr.length; t++){
      if(arr[i] > arr[t]){
        let u = arr[i];
        arr[i] = arr[t];
        arr[t] = u;
      }
    }
  }

}

}