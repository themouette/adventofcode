import { join } from "path";
import { loadRawFile } from "../utils/load-raw-file";

const input = loadRawFile(join(__dirname, "input.txt"));

const prepareInput = (input: string) => input;

export function executePart1(input: string) {
  const data = prepareInput(input);
  return 1;
}

function todayPart1() {
  return executePart1(input);
}

export function executePart2(input: string) {
  const data = prepareInput(input);
  return 1;
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
