import { join } from "path";
import { loadFile, assertEqual } from "../utils";

const input = loadFile(join(__dirname, "input.txt")).join("\n");

const exampleInput = ``;

const prepareInput = (input: string) => input;

const executePart1 = (input: string) => {
  const data = prepareInput(input);
  return 1;
};

function todayPart1() {
  assertEqual(executePart1(exampleInput), 1, "part 1 input");
  return executePart1(input);
}

function executePart2(input: string) {
  const data = prepareInput(input);
  return 1;
}

function todayPart2() {
  assertEqual(executePart2(exampleInput), 1, "part 2 input");
  return executePart2(input);
}

function main() {
  console.log("Part 1", todayPart1());
  console.log("Part 2", todayPart2());
}
main();
