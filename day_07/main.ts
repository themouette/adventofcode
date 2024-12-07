import { join } from "path";
import { loadFile, removeEmptyLines, assertEqual } from "../utils";

const input = loadFile(join(__dirname, "input.txt")).join("\n");

const exampleInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

const prepareInput = (input: string) =>
  removeEmptyLines(input).map((line) => {
    const [result, numbers] = line.split(":").map((x) => x.trim());
    return {
      result: Number(result),
      numbers: numbers.split(" ").map((x) => parseInt(x)),
    };
  });

const isValid = (data: { result: number; numbers: number[] }): boolean => {
  const { result, numbers } = data;
  if (numbers.length === 0) {
    return result === 0;
  }

  const last = numbers[numbers.length - 1];
  const head = numbers.slice(0, numbers.length - 1);
  const isValidUsingMultiply =
    last !== 0 && result / last === Math.floor(result / last)
      ? isValid({ result: result / last, numbers: head })
      : false;
  const isValidUsingAdd = isValid({ result: result - last, numbers: head });

  return isValidUsingMultiply || isValidUsingAdd;
};

assertEqual(isValid({ result: 24, numbers: [2, 3, 4] }), true, "isValid *");
assertEqual(isValid({ result: 9, numbers: [2, 3, 4] }), true, "isValid +");
assertEqual(
  isValid({ result: 10, numbers: [2, 3, 4] }),
  true,
  "isValid * and +"
);
assertEqual(
  isValid({ result: 20, numbers: [2, 3, 4] }),
  true,
  "isValid + and *"
);

const executePart1 = (input: string) => {
  const data = prepareInput(input);
  return data.filter(isValid).reduce((acc, { result }) => acc + result, 0);
};

function todayPart1() {
  assertEqual(executePart1(exampleInput), 3749, "part 1 input");
  return executePart1(input);
}

const isValidWithConcat = (data: {
  result: number;
  numbers: number[];
}): boolean => {
  const { result, numbers } = data;
  if (numbers.length === 0) {
    return result === 0;
  }

  const last = numbers[numbers.length - 1];
  const head = numbers.slice(0, numbers.length - 1);

  const isValidUsingConcat = `${result}`.endsWith(`${last}`)
    ? isValidWithConcat({
        result: Number(
          `${result}`.slice(0, `${result}`.length - `${last}`.length)
        ),
        numbers: head,
      })
    : false;
  const isValidUsingMultiply =
    last !== 0 && result / last === Math.floor(result / last)
      ? isValidWithConcat({ result: result / last, numbers: head })
      : false;
  const isValidUsingAdd = isValidWithConcat({
    result: result - last,
    numbers: head,
  });

  return isValidUsingMultiply || isValidUsingAdd || isValidUsingConcat;
};

assertEqual(
  isValidWithConcat({ result: 24, numbers: [2, 3, 4] }),
  true,
  "isValid *"
);
assertEqual(
  isValidWithConcat({ result: 9, numbers: [2, 3, 4] }),
  true,
  "isValid +"
);
assertEqual(
  isValidWithConcat({ result: 10, numbers: [2, 3, 4] }),
  true,
  "isValid * and +"
);
assertEqual(
  isValidWithConcat({ result: 20, numbers: [2, 3, 4] }),
  true,
  "isValid + and *"
);
assertEqual(
  isValidWithConcat({ result: 7290, numbers: [6, 8, 6, 15] }),
  true,
  "isValid 6 * 8 || 6 * 15"
);
assertEqual(
  isValidWithConcat({ result: 192, numbers: [17, 8, 14] }),
  true,
  "isValid 17 || 8 + 14"
);
assertEqual(
  isValidWithConcat({ result: 178, numbers: [17, 8] }),
  true,
  "isValid 17 || 8"
);

function executePart2(input: string) {
  const data = prepareInput(input);
  return data
    .filter(isValidWithConcat)
    .reduce((acc, { result }) => acc + result, 0);
}

function todayPart2() {
  assertEqual(executePart2(exampleInput), 11387, "part 2 input");
  return executePart2(input);
}

function main() {
  console.log("Part 1", todayPart1());
  console.log("Part 2", todayPart2());
}
main();
