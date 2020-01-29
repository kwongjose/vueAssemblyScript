import { DemoStuff } from '../index';

describe("example", (): void => {
  it("Should have name be SpongeBob", (): void => {
    const stringName = "SpongeBob";
    let  demoInstance = new DemoStuff(stringName);
    expect(demoInstance.getName()).toStrictEqual(stringName);
  });

  it("Should return 5th Fibonacci number", (): void => {
    let  demoInstance = new DemoStuff("");

    expect(demoInstance.fib(5)).toBe(5);
  });
});
