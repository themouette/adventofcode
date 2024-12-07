import { readFileSync } from "fs";

export function loadRawFile(fileName: string = "input.txt"): string {
  return readFileSync(fileName, "utf8").trim();
}

export function removeEmptyLines(input: string): string[] {
  return input.split("\n").filter((line) => line.trim().length);
}

export function loadFile(fileName: string = "input.txt"): string[] {
  return loadRawFile(fileName)
    .split("\n")
    .filter((line: string) => line.trim().length);
}

export function loadDataAsRows(fileName: string = "input.txt"): number[][] {
  return (
    loadFile(fileName)
      // Remove empty lines
      .filter((line) => line.trim().length)
      .map((line) => line.split(" ").map(Number))
  );
}

export function loadDataAsColumns(fileName: string = "input.txt"): number[][] {
  const rows = loadDataAsRows(fileName);
  const columns: number[][] = [];
  for (let i = 0; i < rows[0].length; i++) {
    columns.push(rows.map((row) => row[i]));
  }
  return columns;
}

function objectEquals(x: any, y: any): boolean {
  if (x === null || x === undefined || y === null || y === undefined) {
    return x === y;
  }
  // after this just checking type of one would be enough
  if (x.constructor !== y.constructor) {
    return false;
  }
  // if they are functions, they should exactly refer to same one (because of closures)
  if (x instanceof Function) {
    return x === y;
  }
  // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
  if (x instanceof RegExp) {
    return x === y;
  }
  if (x === y || x.valueOf() === y.valueOf()) {
    return true;
  }
  if (Array.isArray(x) && x.length !== y.length) {
    return false;
  }

  // if they are dates, they must had equal valueOf
  if (x instanceof Date) {
    return false;
  }

  // if they are strictly equal, they both need to be object at least
  if (!(x instanceof Object)) {
    return false;
  }
  if (!(y instanceof Object)) {
    return false;
  }

  // recursive object equality check
  var p = Object.keys(x);
  return (
    Object.keys(y).every(function (i) {
      return p.indexOf(i) !== -1;
    }) &&
    p.every(function (i) {
      return objectEquals(x[i], y[i]);
    })
  );
}

export function assertEqual(a: any, b: any, message?: string) {
  if (!objectEquals(a, b)) {
    console.error(`❌ ${message} `, a, ` !== `, b);
  } else {
    console.log(`✅ ${message}`);
  }
}
