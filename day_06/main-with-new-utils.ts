import { join } from "path";
import { assertDeepEqual } from "../utils/assert-deep-equal";
import { loadRawFile } from "../utils/load-raw-file";
import {
  findInGrid,
  Grid,
  isWithinBounds,
  mustGetGrid,
  safeGetGrid,
  safeSetGridImmutable,
  safeSetGridMutable,
  strToGrid,
} from "../utils/grid";

const exampleInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const input = loadRawFile(join(__dirname, "input.txt"));

const parseInput = (input: string): Grid<string> => {
  return strToGrid(input, (value) => value);
};

function turnRight(direction: { x: number; y: number }) {
  return { x: -direction.y, y: direction.x };
}

const executePart1 = (input: string) => {
  const map = parseInput(input);
  // find the starting point
  const guardInitialPosition = findInGrid(map, "^");
  if (!guardInitialPosition) {
    throw new Error("Guard not found");
  }

  let guardPosition = guardInitialPosition;
  // Initial direction is north
  let direction = { x: 0, y: -1 };
  let walkedTiles = 0;

  while (isWithinBounds(map, guardPosition.x, guardPosition.y)) {
    const { x, y } = guardPosition;
    const nextPosition = { x: x + direction.x, y: y + direction.y };

    if (!isWithinBounds(map, nextPosition.x, nextPosition.y)) {
      return walkedTiles;
    }

    if (map[nextPosition.y][nextPosition.x] === "#") {
      direction = turnRight(direction);
    } else {
      if (safeGetGrid(map, nextPosition.x, nextPosition.y) !== "X") {
        safeSetGridMutable(map, nextPosition.x, nextPosition.y, "X");
        walkedTiles++;
      }
      guardPosition = nextPosition;
    }
  }
};

const isLoop = (
  map: Grid<string>,
  guardInitialPosition: { x: number; y: number }
) => {
  let guardPosition = guardInitialPosition;
  // Initial direction is north
  let direction = { x: 0, y: -1 };
  // Keep track of previous turns
  // If a guard turns on the same tile twice with the same direction, it is a
  // loop
  let turns: string[] = [];

  while (isWithinBounds(map, guardPosition.x, guardPosition.y)) {
    const { x, y } = guardPosition;
    const nextPosition = { x: x + direction.x, y: y + direction.y };

    if (!isWithinBounds(map, nextPosition.x, nextPosition.y)) {
      // Guard exited the room
      return false;
    }

    if (["#", "O"].includes(mustGetGrid(map, nextPosition.x, nextPosition.y))) {
      let command = `${x},${y}:${direction.x},${direction.y}`;
      // Guard already turned on this tile with the same direction
      // It is a loop
      if (turns.includes(command)) {
        return true;
      }
      turns.push(command);
      direction = turnRight(direction);
    } else {
      if (safeGetGrid(map, nextPosition.x, nextPosition.y) !== "X") {
        safeSetGridMutable(map, nextPosition.x, nextPosition.y, "X");
      }
      guardPosition = nextPosition;
    }
  }
};

const isLoopTest = (test: string, expected: boolean, desc: string) => {
  const map = parseInput(test);
  const guardInitialPosition = findInGrid(map, "^");
  if (!guardInitialPosition) {
    throw new Error("Guard not found");
  }
  assertDeepEqual(isLoop(map, guardInitialPosition), expected, desc);
};

isLoopTest(
  `..........
....#.....
....^#....
..........`,
  false,
  "can exit when locked by 2 blocks"
);
isLoopTest(
  `..........
....#.....
....^...#.
...#......
.......#..`,
  true,
  "can not exit when in a loop"
);
isLoopTest(
  `..........
....#.....
...#^#....
....#.....`,
  true,
  "can not exit when surrounded by 4 blocks"
);

const executePart2 = (input: string) => {
  const map = parseInput(input);
  // find the starting point
  const guardInitialPosition = findInGrid(map, "^");
  if (!guardInitialPosition) {
    throw new Error("Guard not found");
  }

  let loopCount = 0;

  let guardPosition = guardInitialPosition;
  // Initial direction is north
  let direction = { x: 0, y: -1 };

  while (isWithinBounds(map, guardPosition.x, guardPosition.y)) {
    const { x, y } = guardPosition;
    const nextPosition = { x: x + direction.x, y: y + direction.y };

    if (!isWithinBounds(map, nextPosition.x, nextPosition.y)) {
      break;
    }

    if (safeGetGrid(map, nextPosition.x, nextPosition.y) === "#") {
      direction = turnRight(direction);
    } else {
      if (safeGetGrid(map, nextPosition.x, nextPosition.y) !== "X") {
        const mapCandidate = safeSetGridImmutable(
          map,
          nextPosition.x,
          nextPosition.y,
          "O"
        );
        if (isLoop(mapCandidate, guardInitialPosition)) {
          loopCount++;
        }
      }
      safeSetGridMutable(map, nextPosition.x, nextPosition.y, "X");
      guardPosition = nextPosition;
    }
  }

  return loopCount;
};

const main = () => {
  assertDeepEqual(executePart1(exampleInput), 41, "Part 1 example");
  console.log("part 1", executePart1(input));

  assertDeepEqual(executePart2(exampleInput), 6, "Part 2 example");
  console.log("part 2", executePart2(input));
};
main();
