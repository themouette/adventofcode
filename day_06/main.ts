import { join } from "path";
import { loadFile, assertEqual, removeEmptyLines } from "../utils";

const input = loadFile(join(__dirname, "input.txt")).join("\n");

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

const prepareInput = (input: string): string[][] => {
  return removeEmptyLines(input).map((line) => line.split(""));
};

function getGuardPosition(data: string[][]) {
  const y = data.findIndex((row) => row.includes("^"));
  const x = data[y].indexOf("^");
  return { x, y };
}

function isWithinBounds(data: string[][], position: { x: number; y: number }) {
  return (
    position.y >= 0 &&
    position.y < data.length &&
    position.x >= 0 &&
    position.x < data[position.y].length
  );
}

function turnRight(direction: { x: number; y: number }) {
  return { x: -direction.y, y: direction.x };
}

assertEqual(turnRight({ x: 0, y: -1 }), { x: 1, y: 0 }, "turn right ^ -> >");
assertEqual(turnRight({ x: 1, y: 0 }), { x: 0, y: 1 }, "turn right > -> v");
assertEqual(turnRight({ x: 0, y: 1 }), { x: -1, y: 0 }, "turn right v => <");
assertEqual(turnRight({ x: -1, y: 0 }), { x: 0, y: -1 }, "turn right < -> ^");

const executePart1 = (input: string) => {
  const data = prepareInput(input);
  // find the starting point
  let guardPosition = getGuardPosition(data);
  // Initial direction is north
  let direction = { x: 0, y: -1 };
  let walkedTiles = 1;

  while (isWithinBounds(data, guardPosition)) {
    const { x, y } = guardPosition;
    const nextPosition = { x: x + direction.x, y: y + direction.y };

    if (!isWithinBounds(data, nextPosition)) {
      return walkedTiles;
    }

    const nextTile = data[nextPosition.y][nextPosition.x];
    if (isWithinBounds(data, nextPosition) && nextTile === "#") {
      // Turn right
      direction = turnRight(direction);
    } else if (isWithinBounds(data, nextPosition)) {
      // Only count as a new tile if it was not yet walked
      if (data[guardPosition.y][guardPosition.x] !== "X") {
        walkedTiles++;
      }
      data[guardPosition.y][guardPosition.x] = "X";
      guardPosition = nextPosition;
    }
  }
};

function todayPart1() {
  assertEqual(executePart1(exampleInput), 41, "part 1 input");
  return executePart1(input);
}

const canExitMaze = (
  data: string[][],
  guardPosition: { x: number; y: number },
  guardDirection: { x: number; y: number }
): boolean => {
  let position = { ...guardPosition };
  let direction = { ...guardDirection };
  // Keep track of previous turns
  // If a guard turns on the same tile twice with the same direction, it is a
  // loop
  let turns: string[] = [];

  while (isWithinBounds(data, position)) {
    const { x, y } = position;
    const nextPosition = { x: x + direction.x, y: y + direction.y };

    if (!isWithinBounds(data, nextPosition)) {
      return true;
    }

    const nextTile = data[nextPosition.y][nextPosition.x];
    if (isWithinBounds(data, nextPosition) && ["#", "O"].includes(nextTile)) {
      // Turn right
      let command = `${x},${y}:${direction.x},${direction.y}`;
      direction = turnRight(direction);

      // Guard already turned on this tile with the same direction
      // It is a loop
      if (turns.includes(command)) {
        return false;
      }
      turns.push(command);
    } else {
      data[y][x] = "X";
      position = nextPosition;
    }
  }
  return true;
};

const assertCanExitMaze = (
  maze: string,
  expected: boolean,
  message: string
) => {
  const data = prepareInput(maze);
  // find the starting point
  let guardPosition = getGuardPosition(data);

  assertEqual(
    canExitMaze(data, guardPosition, { x: 0, y: -1 }),
    expected,
    message
  );
};
assertCanExitMaze(exampleInput, true, "can exit example maze");
assertCanExitMaze(
  `..........
....#.....
....^#....
..........`,
  true,
  "can exit when locked by 2 blocks"
);
assertCanExitMaze(
  `..........
....#.....
....^#....
....#.....`,
  true,
  "can exit when locked by 3 blocks"
);
assertCanExitMaze(
  `..........
....#.....
...#^#....
....#.....`,
  false,
  "can not exit when surrounded by 4 blocks"
);
assertCanExitMaze(
  `..........
....#.....
....^...#.
..........
...#...#..`,
  true,
  "can not exit when in a loop"
);

function executePart2(input: string) {
  const data = prepareInput(input);
  const initialPosition = getGuardPosition(data);
  let position = { ...initialPosition };
  // Initial direction is north
  let direction = { x: 0, y: -1 };
  let successfulChanges: Set<string> = new Set();

  // This is a brute force solution that is way slower than the next one
  // It tries to change every possible tile to a wall and check if the guard
  // can exit the maze
  // for (let y = 0; y < data.length; y++) {
  //   for (let x = 0; x < data[y].length; x++) {
  //     const nextData = data.map((row) => [...row]);
  //     nextData[y][x] = "O";
  //     if (!canExitMaze(nextData, position, direction)) {
  //       successfulChanges.add(`${x},${y}`);
  //     }
  //   }
  // }

  // Navigate the maze and test the possibility if next tile is tranformed to a
  // wall
  // This divides the execution time by 2 with the example input
  while (isWithinBounds(data, position)) {
    const { x, y } = position;
    const nextPosition = { x: x + direction.x, y: y + direction.y };

    if (!isWithinBounds(data, nextPosition)) {
      console.log("Exit found");
      break;
    }

    const nextTile = data[nextPosition.y][nextPosition.x];
    if (isWithinBounds(data, nextPosition) && ["#", "O"].includes(nextTile)) {
      direction = turnRight(direction);
    } else {
      // create a copy of current maze with next tile transformed to a wall
      const nextData = data.map((row) => [...row]);
      nextData[nextPosition.y][nextPosition.x] = "O";
      if (!canExitMaze(nextData, { ...initialPosition }, { x: 0, y: -1 })) {
        successfulChanges.add(`${nextPosition.x},${nextPosition.y}`);
      }
      position = nextPosition;
    }
  }

  return successfulChanges.size;
}

function todayPart2() {
  assertEqual(executePart2(exampleInput), 6, "part 2 input");
  return executePart2(input);
}

function main() {
  console.log("Part 1", todayPart1());
  console.log("Part 2", todayPart2());
}
main();
