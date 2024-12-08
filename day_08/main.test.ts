import {
  GridPosition,
  gridToString,
  isWithinBounds,
  strToGrid,
} from "../utils/grid";
import {
  allNodesOnLine,
  executePart1,
  executePart2,
  findAntiNodesOnFullLine,
  isAntenna,
} from "./main";

const exampleInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

describe("isAntenna", () => {
  it("should return true for a valid antenna", () => {
    expect(isAntenna("A")).toBe(true);
    expect(isAntenna("a")).toBe(true);
    expect(isAntenna("3")).toBe(true);
  });
  it("should return false for an invalid antenna", () => {
    expect(isAntenna(".")).toBe(false);
  });
});

describe("executePart1", () => {
  it("simplified input", () => {
    expect(
      executePart1(
        `..........
        ..........
        ..........
        ....a.....
        ..........
        .....a....
        ..........
        ..........
        ..........
        ..........`
      )
    ).toBe(2);
  });

  it("part 1 input", () => {
    expect(executePart1(exampleInput)).toBe(14);
  });
});

describe("executePart2", () => {
  it("simplified input", () => {
    expect(
      executePart2(
        `T.........
         ...T......
         .T........
         ..........
         ..........
         ..........
         ..........
         ..........
         ..........
         ..........`
      )
    ).toBe(9);
  });
  it("part 2 input", () => {
    expect(executePart2(exampleInput)).toBe(34);
  });
});

describe("allNodesOnLine", () => {
  const mutateAllNodesOnLine = (
    input: string,
    start: GridPosition,
    direction: GridPosition
  ) => {
    const grid = strToGrid(input, (x) => x);
    const nodes = allNodesOnLine(grid, start, direction);

    nodes
      .filter(({ x, y }) => isWithinBounds(grid, x, y))
      .forEach(({ x, y }) => {
        grid[y][x] = "X";
      });
    return grid;
  };
  it("should return all nodes on a line", () => {
    expect(
      mutateAllNodesOnLine(
        `
        ..........
        ..........
        ..........
        ..........
        ..........`,
        { x: 0, y: 0 },
        { x: 1, y: 1 }
      )
    ).toEqual(
      strToGrid(
        `
        X.........
        .X........
        ..X.......
        ...X......
        ....X.....`,
        (x) => x
      )
    );
  });
  it("should return all nodes on a line - start center", () => {
    expect(
      mutateAllNodesOnLine(
        `
        ..........
        ..........
        ..........
        ..........
        ..........`,
        { x: 5, y: 2 },
        { x: 1, y: 1 }
      )
    ).toEqual(
      strToGrid(
        `
        ...X......
        ....X.....
        .....X....
        ......X...
        .......X..`,
        (x) => x
      )
    );
  });
  it("should return all nodes on a line - x: 2, y: 1", () => {
    expect(
      gridToString(
        mutateAllNodesOnLine(
          `
        ..........
        ..........
        ..........
        ..........
        ..........`,
          { x: 5, y: 2 },
          { x: 2, y: 1 }
        )
      )
    ).toEqual(
      gridToString(
        strToGrid(
          `
        .X........
        ...X......
        .....X....
        .......X..
        .........X`,
          (x) => x
        )
      )
    );
  });
  it("should return all nodes on a line - x: 2, y: 3", () => {
    expect(
      gridToString(
        mutateAllNodesOnLine(
          `
        ..........
        ..........
        ..........
        ..........
        ..........`,
          { x: 5, y: 1 },
          { x: 2, y: 3 }
        )
      )
    ).toEqual(
      gridToString(
        strToGrid(
          `
        ..........
        .....X....
        ..........
        ..........
        .......X..`,
          (x) => x
        )
      )
    );
  });
});
