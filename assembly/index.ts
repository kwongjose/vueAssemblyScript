// The entry file of your WebAssembly module.
@external('env', 'jsFunc')
declare function jsFunc(val: i32): i32;
export const F64ID = idof<Float64Array>();
export class DemoStuff {

private arr: Float64Array;
private myName: string;
constructor(private name: string ) {
  this.myName = name;
  this.arr = new Float64Array(500);
  NativeMath.seedRandom(Date.now());

}

getName (): string {
  return this.myName;
}

setArray(): void {
  for(let i = 0; i < 500; i++) {
    this.arr[i] = (Math.random() * 1000) +1
  }
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

callInnerSqr(): void {
  this.calcSqrSort(this.arr);
}

calcSqrSort(arr: Float64Array): void {
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

}

}