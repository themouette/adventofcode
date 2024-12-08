import { parseAsLines } from "./parse-as-lines";

export type Grid<T = string> = T[][];

export const strToGrid = <T>(
  str: string,
  transform: (x: string) => T,
  {
    removeEmptyLines = true,
    trim = true,
  }: {
    /** Should the output be sanitized by removing empty lines? */
    removeEmptyLines?: boolean;
    /** Should the output be sanitized by trimming each line? */
    trim?: boolean;
  } = {}
): Grid<T> => {
  return parseAsLines(str, { removeEmptyLines, trim }).map((row) =>
    row.split("").map(transform)
  );
};

export const copyGrid = <T>(grid: Grid<T>): Grid<T> => {
  return grid.map((row) => row.slice());
};

export const newEmptyGrid = <T>(
  width: number,
  height: number,
  value: T
): Grid<T> => {
  return Array.from({ length: height }, () => Array(width).fill(value));
};

export const isWithinBounds = <T>(
  grid: Grid<T>,
  x: number,
  y: number
): boolean => {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
};

export const mustGetGrid = <T>(grid: Grid<T>, x: number, y: number): T => {
  if (!isWithinBounds(grid, x, y)) {
    throw new Error(`Out of bounds: ${x}, ${y}`);
  }
  return grid[y][x];
};

export const safeGetGrid = <T>(
  grid: Grid<T>,
  x: number,
  y: number
): T | undefined => {
  return isWithinBounds(grid, x, y) ? mustGetGrid(grid, x, y) : undefined;
};

export const mustSetGridMutable = <T>(
  grid: Grid<T>,
  x: number,
  y: number,
  value: T
): Grid<T> => {
  if (!isWithinBounds(grid, x, y)) {
    throw new Error(`Out of bounds: ${x}, ${y}`);
  }
  // Do not make a copy for a performance reason
  grid[y][x] = value;

  return grid;
};

export const safeSetGridMutable = <T>(
  grid: Grid<T>,
  x: number,
  y: number,
  value: T
): Grid<T> => {
  if (!isWithinBounds(grid, x, y)) {
    return grid;
  }
  return mustSetGridMutable(grid, x, y, value);
};

export const mustSetGridImmutable = <T>(
  grid: Grid<T>,
  x: number,
  y: number,
  value: T
): Grid<T> => {
  if (!isWithinBounds(grid, x, y)) {
    throw new Error(`Out of bounds: ${x}, ${y}`);
  }
  const result = copyGrid(grid);
  result[y][x] = value;

  return result;
};

export const safeSetGridImmutable = <T>(
  grid: Grid<T>,
  x: number,
  y: number,
  value: T
): Grid<T> => {
  if (!isWithinBounds(grid, x, y)) {
    return grid;
  }
  return mustSetGridImmutable(grid, x, y, value);
};

export const debugGrid = <T>(grid: Grid<T>): void => {
  console.log(grid.map((row) => row.join("")).join("\n"));
};

export const findInGrid = <T>(
  grid: Grid<T>,
  predicate: T | ((value: T) => boolean)
): { x: number; y: number } | undefined => {
  const predicateFn =
    typeof predicate === "function"
      ? (predicate as (value: T) => boolean)
      : (value: T) => value === predicate;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (predicateFn(grid[y][x])) {
        return { x, y };
      }
    }
  }
  return undefined;
};
