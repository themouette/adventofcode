import {
  copyGrid,
  findInGrid,
  isWithinBounds,
  mustGetGrid,
  mustSetGridImmutable,
  mustSetGridMutable,
  newEmptyGrid,
  debugGrid,
  safeGetGrid,
  safeSetGridImmutable,
  safeSetGridMutable,
  strToGrid,
} from "./grid";

describe("strToGrid", () => {
  it("should convert a string to a grid", () => {
    const str = `abc
def
ghi`;
    const grid = strToGrid(str, (x) => x);
    expect(grid).toEqual([
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ]);
  });
});

describe("copyGrid", () => {
  it("should copy a grid", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    const copied = copyGrid(grid);
    expect(copied).toEqual(grid);
    expect(copied).not.toBe(grid);
  });
});

describe("newEmptyGrid", () => {
  it("should create a new empty grid", () => {
    const grid = newEmptyGrid(3, 3, "a");
    expect(grid).toEqual([
      ["a", "a", "a"],
      ["a", "a", "a"],
      ["a", "a", "a"],
    ]);
  });
});

describe("isWithinBounds", () => {
  it("should check if a point is within bounds", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    expect(isWithinBounds(grid, 0, 0)).toBe(true);
    expect(isWithinBounds(grid, 2, 2)).toBe(true);
    expect(isWithinBounds(grid, 3, 3)).toBe(false);
    expect(isWithinBounds(grid, -1, -1)).toBe(false);
  });
});

describe("mustGetGrid", () => {
  it("should get a value from a grid", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    expect(mustGetGrid(grid, 0, 0)).toBe("a");
    expect(mustGetGrid(grid, 2, 2)).toBe("i");
    expect(() => mustGetGrid(grid, 3, 3)).toThrow("Out of bounds: 3, 3");
  });
});

describe("safeGetGrid", () => {
  it("should get a value from a grid safely", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    expect(safeGetGrid(grid, 0, 0)).toBe("a");
    expect(safeGetGrid(grid, 2, 2)).toBe("i");
    expect(safeGetGrid(grid, 3, 3)).toBeUndefined();
  });
});

describe("mustSetGridMutable", () => {
  it("should set a value to a grid", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    const newGrid = mustSetGridMutable(grid, 0, 0, "x");
    expect(newGrid).toEqual([
      ["x", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ]);
    expect(() => mustSetGridMutable(grid, 3, 3, "x")).toThrow(
      "Out of bounds: 3, 3"
    );
  });
});

describe("safeSetGridMutable", () => {
  it("should set a value to a grid safely", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    const newGrid = safeSetGridMutable(grid, 0, 0, "x");
    expect(newGrid).toBe(grid);
    expect(newGrid).toEqual([
      ["x", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ]);
    expect(safeSetGridMutable(grid, 3, 3, "x")).toBe(grid);
  });
});

describe("mustSetGridImmutable", () => {
  it("should set a value to a grid immutably", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    const newGrid = mustSetGridImmutable(grid, 0, 0, "x");
    expect(newGrid).not.toBe(grid);
    expect(newGrid).toEqual([
      ["x", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ]);
    expect(() => mustSetGridImmutable(grid, 3, 3, "x")).toThrow(
      "Out of bounds: 3, 3"
    );
  });
});

describe("safeSetGridImmutable", () => {
  it("should set a value to a grid immutably", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    const newGrid = safeSetGridImmutable(grid, 0, 0, "x");
    expect(newGrid).not.toBe(grid);
    expect(newGrid).toEqual([
      ["x", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ]);
    expect(safeSetGridImmutable(grid, 3, 3, "x")).toBe(grid);
  });
});

describe("safeSetGridImmutable", () => {
  it("should set a value to a grid immutably", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    const newGrid = safeSetGridImmutable(grid, 0, 0, "x");
    expect(newGrid).not.toBe(grid);
    expect(newGrid).toEqual([
      ["x", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ]);
    expect(safeSetGridImmutable(grid, 3, 3, "x")).toBe(grid);
  });
});

describe("debugGrid", () => {
  it("should print a grid", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    const log = jest.spyOn(console, "log").mockImplementation();
    debugGrid(grid);
    expect(log).toHaveBeenCalledWith(`abc
def
ghi`);
    log.mockRestore();
  });
});

describe("findInGrid", () => {
  it("should find a value in a grid", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    expect(findInGrid(grid, "e")).toEqual({ x: 1, y: 1 });
    expect(findInGrid(grid, "x")).toBeUndefined();
  });
});
