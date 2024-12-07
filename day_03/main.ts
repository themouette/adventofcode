import { join } from "path";
import { loadFile, assertEqual } from "../utils";

function executeMultiplication(expression: string): number {
  const mulRegex = /^mul\((\d+),(\d+)\)/;
  let str = expression;
  let result = 0;
  while (str.length > 0) {
    // Check if this start with a valid instruction
    const match = mulRegex.exec(str);
    if (match) {
      const [_, a, b] = match;
      result += parseInt(a) * parseInt(b);
      str = str.substring(match.index + match[0].length);
    } else {
      // move by one character
      str = str.substring(1);
    }
  }
  return result;
}

function executeMultiplicationWithConditional(expression: string): number {
  const mulRegex = /^mul\((\d+),(\d+)\)/;
  const doRegex = /^do\(\)/;
  const dontRegex = /^don't\(\)/;

  let str = expression;
  let result = 0;
  let conditionalFlag = true;

  while (str.length > 0) {
    // Check if this start with a valid instruction
    if (mulRegex.test(str) && conditionalFlag) {
      const match = mulRegex.exec(str);
      if (match) {
        const [_, a, b] = match;
        result += parseInt(a) * parseInt(b);
        str = str.substring(match.index + match[0].length);
      }
    } else if (doRegex.test(str)) {
      conditionalFlag = true;
      str = str.substring(4);
    } else if (dontRegex.test(str)) {
      conditionalFlag = false;
      str = str.substring(7);
    } else {
      // move by one character
      str = str.substring(1);
    }
  }
  return result;
}

function part1() {
  const data = loadFile(join(__dirname, "input.txt"));

  return executeMultiplication(data.join("\n"));
}

function part2() {
  const data = loadFile(join(__dirname, "input.txt"));

  return executeMultiplicationWithConditional(data.join("\n"));
}

function main() {
  console.log("part 1", part1());
  console.log("part 2", part2());
}
main();

function testPart1() {
  assertEqual(executeMultiplication("mul(1,2)"), 2, "Test 1");
  assertEqual(executeMultiplication("mul(2,2)"), 4, "Test 2");
  assertEqual(executeMultiplication("do_not_mul(2,3)"), 6, "Test 3");
  // Ignore
  assertEqual(executeMultiplication("mul(4*"), 0, "Should be ignored");
  assertEqual(executeMultiplication("mul(6,9!"), 0, "Should be ignored");
  assertEqual(executeMultiplication("?(12,34)"), 0, "Should be ignored");
  assertEqual(executeMultiplication("mul ( 2 , 4 )"), 0, "Should be ignored");
  // Example from exercise
  assertEqual(
    executeMultiplication(
      "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"
    ),
    161,
    "Example from exercise"
  );
}
testPart1();

function testPart2() {
  assertEqual(executeMultiplicationWithConditional("mul(1,2)"), 2, "Test 1");
  assertEqual(
    executeMultiplicationWithConditional("do()mul(1,2)"),
    2,
    "Test 2"
  );
  assertEqual(
    executeMultiplicationWithConditional("don't()mul(1,2)"),
    0,
    "Test 3"
  );
  assertEqual(
    executeMultiplicationWithConditional(
      "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"
    ),
    48,
    "Example from exercise"
  );
}
testPart2();
