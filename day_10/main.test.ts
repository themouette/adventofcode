import {
  executePart1,
  executePart2,
  findTrailHeads,
  findTrailScore,
  getReachablePeaks,
  prepareInput,
  uniquePositions,
} from "./main";

const exampleInput = `
  89010123
  78121874
  87430965
  96549874
  45678903
  32019012
  01329801
  10456732`;

describe("findTrailHeads", () => {
  it("simple test", () => {
    const input = `
          0123
          1234
          8765
          9876`;
    const data = prepareInput(input);
    const trailhead = findTrailHeads(data);
    expect(trailhead).toEqual([{ y: 0, x: 0 }]);
  });

  it("Multiple trailheads", () => {
    const input = `
          89010123
          78121874
          87430965
          96549874
          45678903
          32019012
          01329801
          10456732`;
    const data = prepareInput(input);
    const trailhead = findTrailHeads(data);
    expect(trailhead).toEqual([
      { y: 0, x: 2 },
      { y: 0, x: 4 },
      { y: 2, x: 4 },
      { y: 4, x: 6 },
      { y: 5, x: 2 },
      { y: 5, x: 5 },
      { y: 6, x: 0 },
      { y: 6, x: 6 },
      { y: 7, x: 1 },
    ]);
  });
});

describe("uniquePositions", () => {
  it("simple test", () => {
    const input = [
      { y: 0, x: 0 },
      { y: 0, x: 0 },
    ];
    const result = uniquePositions(input);
    expect(result).toEqual([{ y: 0, x: 0 }]);
  });
  it("only unique positions", () => {
    const input = [
      { y: 0, x: 0 },
      { y: 0, x: 1 },
    ];
    const result = uniquePositions(input);
    expect(result).toEqual(input);
  });
});

describe("getReachablePeaks", () => {
  it("simple test", () => {
    const input = `
            0123
            1234
            8765
            9876`;
    const data = prepareInput(input);
    const result = getReachablePeaks(data, { y: 0, x: 0 });
    expect(result).toEqual([{ y: 3, x: 0 }]);
  });
  it("multiple reacheable peaks", () => {
    const input = `
            0123
            9234
            8765
            9876`;
    const data = prepareInput(input);
    const result = getReachablePeaks(data, { y: 0, x: 0 });
    expect(result).toEqual([
      { y: 3, x: 0 },
      { y: 1, x: 0 },
    ]);
  });
});

describe("findTrailScore", () => {
  it("with example, starts at {x:2, y: 0}", () => {
    const data = prepareInput(exampleInput);
    const result = findTrailScore(data, { x: 2, y: 0 });
    expect(result).toBe(5);
  });
  it("with example, starts at {x:4, y: 0}", () => {
    const data = prepareInput(exampleInput);
    const result = findTrailScore(data, { x: 4, y: 0 });
    expect(result).toBe(6);
  });
  it("with example, starts at {x:4, y: 2}", () => {
    const data = prepareInput(exampleInput);
    const result = findTrailScore(data, { x: 4, y: 2 });
    expect(result).toBe(5);
  });
  it("with example, starts at {x:6, y: 4}", () => {
    const data = prepareInput(exampleInput);
    const result = findTrailScore(data, { x: 6, y: 4 });
    expect(result).toBe(3);
  });
  it("with example, starts at {x:2, y: 5}", () => {
    const data = prepareInput(exampleInput);
    const result = findTrailScore(data, { x: 2, y: 5 });
    expect(result).toBe(1);
  });
});

describe("part 1", () => {
  it("example", () => {
    expect(executePart1(exampleInput)).toBe(36);
  });
});
describe("part 2", () => {
  it("example", () => {
    expect(executePart2(exampleInput)).toBe(81);
  });
});
