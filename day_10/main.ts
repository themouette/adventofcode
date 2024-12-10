import { join } from "path";
import { loadRawFile } from "../utils/load-raw-file";
import type { GridPosition, Grid } from "../utils/grid";
import { isWithinBounds, strToGrid } from "../utils/grid";

const input = loadRawFile(join(__dirname, "input.txt"));

export const prepareInput = (input: string) => strToGrid(input, Number);

const TRAIL_HEAD = 0;
const HIGH_PEAK = 9;
const POSSIBLE_DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

export function findTrailHeads(map: Grid<number>) {
  return map.reduce((acc: GridPosition[], row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === TRAIL_HEAD) {
        acc.push({ x, y });
      }
    }
    return acc;
  }, []);
}

export const getReachablePeaks = (
  map: Grid<number>,
  position: GridPosition
) => {
  if (!isWithinBounds(map, position.x, position.y)) {
    return [];
  }

  const currentPositionAltitude = map[position.y][position.x];
  if (currentPositionAltitude === HIGH_PEAK) {
    return [position];
  }

  // Get reachable tiles from here
  const reacheableTiles: GridPosition[] = [];
  for (const direction of POSSIBLE_DIRECTIONS) {
    const newPosition = {
      x: position.x + direction.x,
      y: position.y + direction.y,
    };
    if (!isWithinBounds(map, newPosition.x, newPosition.y)) {
      continue;
    }
    const newAltitude = map[newPosition.y][newPosition.x];
    if (newAltitude - currentPositionAltitude !== 1) {
      continue;
    }
    reacheableTiles.push(newPosition);
  }

  return uniquePositions(
    reacheableTiles.flatMap((nextPosition) =>
      getReachablePeaks(map, nextPosition)
    )
  );
};

export function uniquePositions(positions: GridPosition[]) {
  const visited = new Set<string>();
  return positions.filter((position) => {
    const key = `x${position.x}.y${position.y}`;
    if (visited.has(key)) {
      return false;
    }
    visited.add(key);
    return true;
  });
}

export const findTrailScore = (map: Grid<number>, trailhead: GridPosition) => {
  const reachablePeaks = getReachablePeaks(map, trailhead);
  return reachablePeaks.length;
};

export function executePart1(input: string) {
  const data = prepareInput(input);
  const trailheads = findTrailHeads(data);
  const trailScores = trailheads.map((trailhead) =>
    findTrailScore(data, trailhead)
  );
  return trailScores.reduce((acc, score) => acc + score, 0);
}

function todayPart1() {
  return executePart1(input);
}

export const getTrailsToReachPeaks = (
  map: Grid<number>,
  position: GridPosition
): GridPosition[][] => {
  if (!isWithinBounds(map, position.x, position.y)) {
    return [];
  }

  const currentPositionAltitude = map[position.y][position.x];
  if (currentPositionAltitude === HIGH_PEAK) {
    return [[position]];
  }

  // Get reachable tiles from here
  const reacheableTiles: GridPosition[] = [];
  for (const direction of POSSIBLE_DIRECTIONS) {
    const newPosition = {
      x: position.x + direction.x,
      y: position.y + direction.y,
    };
    if (!isWithinBounds(map, newPosition.x, newPosition.y)) {
      continue;
    }
    const newAltitude = map[newPosition.y][newPosition.x];
    if (newAltitude - currentPositionAltitude !== 1) {
      continue;
    }
    reacheableTiles.push(newPosition);
  }
  const subTrails = reacheableTiles.flatMap((nextPosition) =>
    getTrailsToReachPeaks(map, nextPosition)
  );

  return subTrails.map((trail) => [position, ...trail]);
};

const findTrailRating = (map: Grid<number>, trailhead: GridPosition) => {
  const trails = getTrailsToReachPeaks(map, trailhead);
  return trails.length;
};
export function executePart2(input: string) {
  const data = prepareInput(input);
  const trailheads = findTrailHeads(data);
  const trailRatings = trailheads.map((trailhead) =>
    findTrailRating(data, trailhead)
  );
  return trailRatings.reduce((acc, score) => acc + score, 0);
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
