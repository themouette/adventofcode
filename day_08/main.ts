import { join } from "path";
import { loadRawFile } from "../utils/load-raw-file";
import {
  Grid,
  GridPosition,
  isWithinBounds,
  mustGetGrid,
  newEmptyGrid,
  safeGetGrid,
  safeSetGridMutable,
  strToGrid,
} from "../utils/grid";

const input = loadRawFile(join(__dirname, "input.txt"));

const prepareInput = (input: string) => strToGrid(input, (x) => x);

const antennaRegex = /^[\w\d]$/;
export const isAntenna = (x: string) => antennaRegex.test(x);

const findAntiNodes = (
  map: string[][],
  x: number,
  y: number
): Array<{ x: number; y: number }> => {
  const antennaType = mustGetGrid(map, x, y);
  const antiNodes: Array<GridPosition> = [];

  // Only check for antennas south of the position,
  for (let lineNumber = y; lineNumber < map.length; lineNumber++) {
    for (
      let columnNumber = 0;
      columnNumber < map[lineNumber].length;
      columnNumber++
    ) {
      const direction = { x: columnNumber - x, y: lineNumber - y };
      if (direction.x === 0 && direction.y === 0) {
        continue;
      }

      // walk the grid from the antenna to the edge
      // if we find an antenna, we add the antinodes to the list
      let currentWalkPosition = { x: x + direction.x, y: y + direction.y };
      while (
        isWithinBounds(map, currentWalkPosition.x, currentWalkPosition.y)
      ) {
        const value = mustGetGrid(
          map,
          currentWalkPosition.x,
          currentWalkPosition.y
        );
        const distance = {
          x: currentWalkPosition.x - x,
          y: currentWalkPosition.y - y,
        };

        // Move to next position in this direction
        currentWalkPosition = {
          x: currentWalkPosition.x + direction.x,
          y: currentWalkPosition.y + direction.y,
        };

        if (value !== antennaType) {
          continue;
        }
        // we found an antenna of the same type
        // it creates 2 antinodes: one on the opposite side of the antenna and
        // one on the same side
        antiNodes.push({ x: x - distance.x, y: y - distance.y });
        antiNodes.push({
          x: currentWalkPosition.x, // currentWalkPosition has already been incremented
          y: currentWalkPosition.y,
        });
      }
    }
  }

  return antiNodes;
};

export const executePart1 = (input: string) => {
  const map = prepareInput(input);
  const antiNodesMap = newEmptyGrid(map[0].length, map.length, 0);

  let antinodesCount = 0;

  // Walk through the grid, and for each
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const value = mustGetGrid(map, x, y);
      if (!isAntenna(value)) {
        continue;
      }

      for (let antinode of findAntiNodes(map, x, y)) {
        if (!isWithinBounds(antiNodesMap, antinode.x, antinode.y)) {
          continue;
        }
        if (safeGetGrid(antiNodesMap, antinode.x, antinode.y) === 0) {
          safeSetGridMutable(antiNodesMap, antinode.x, antinode.y, 1);
          antinodesCount++;
        }
      }
    }
  }
  return antinodesCount;
};

function todayPart1() {
  return executePart1(input);
}

export const allNodesOnLine = (
  map: Grid<string>,
  start: GridPosition,
  direction: GridPosition
): Array<GridPosition> => {
  const nodes: Array<GridPosition> = [{ ...start }];
  const maxDistance = Math.max(
    map[0].length / direction.x,
    map.length / direction.y
  );
  for (
    let currentDistance = 1;
    currentDistance < maxDistance;
    currentDistance++
  ) {
    let hasAddedNode = false;
    if (
      isWithinBounds(
        map,
        start.x + currentDistance * direction.x,
        start.y + currentDistance * direction.y
      )
    ) {
      hasAddedNode = true;
      nodes.push({
        x: start.x + currentDistance * direction.x,
        y: start.y + currentDistance * direction.y,
      });
    }
    if (
      isWithinBounds(
        map,
        start.x - currentDistance * direction.x,
        start.y - currentDistance * direction.y
      )
    ) {
      hasAddedNode = true;
      nodes.push({
        x: start.x - currentDistance * direction.x,
        y: start.y - currentDistance * direction.y,
      });
    }

    if (!hasAddedNode) {
      break;
    }
  }
  return nodes;
};

export const findAntiNodesOnFullLine = (
  map: string[][],
  x: number,
  y: number
): Array<{ x: number; y: number }> => {
  const antennaType = mustGetGrid(map, x, y);
  const antiNodes: Array<GridPosition> = [];

  // Only check for antennas south of the position,
  for (let lineNumber = 0; lineNumber < map.length - y; lineNumber++) {
    for (
      let columnNumber = -x;
      columnNumber < map[lineNumber].length - x;
      columnNumber++
    ) {
      const direction = {
        x: columnNumber,
        y: lineNumber,
      };
      if (direction.x === 0 && direction.y === 0) {
        continue;
      }

      // walk the grid from the antenna to the edge
      // if we find an antenna, we add the antinodes to the list
      let currentWalkPosition = { x: x + direction.x, y: y + direction.y };
      while (
        isWithinBounds(map, currentWalkPosition.x, currentWalkPosition.y)
      ) {
        const value = mustGetGrid(
          map,
          currentWalkPosition.x,
          currentWalkPosition.y
        );

        // Move to next position in this direction
        currentWalkPosition = {
          x: currentWalkPosition.x + direction.x,
          y: currentWalkPosition.y + direction.y,
        };

        if (value !== antennaType) {
          continue;
        }
        // we found an antenna of the same type
        // Create antinodes on the whole line
        for (const antinode of allNodesOnLine(map, { x, y }, direction)) {
          antiNodes.push(antinode);
        }
        // No need to move further, we found an antenna
        break;
      }
    }
  }

  return antiNodes;
};

export function executePart2(input: string) {
  const map = prepareInput(input);
  const antiNodesMap = newEmptyGrid(map[0].length, map.length, ".");

  let antinodesCount = 0;

  // Walk through the grid, and for each
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const value = mustGetGrid(map, x, y);
      if (!isAntenna(value)) {
        continue;
      }

      for (let antinode of findAntiNodesOnFullLine(map, x, y)) {
        if (!isWithinBounds(antiNodesMap, antinode.x, antinode.y)) {
          continue;
        }
        if (safeGetGrid(antiNodesMap, antinode.x, antinode.y) === ".") {
          safeSetGridMutable(antiNodesMap, antinode.x, antinode.y, "#");
          antinodesCount++;
        }
      }
    }
  }
  return antinodesCount;
}

function todayPart2() {
  return executePart2(input);
}

function main() {
  console.log("Part 1", todayPart1());
  console.log("Part 2", todayPart2());
}
if (require.main === module) {
  main();
}
