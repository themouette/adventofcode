import { join } from "path";
import { loadFile, assertEqual } from "../utils";

function isValidPosition(
  input: string[][],
  positionX: number,
  positionY: number
): boolean {
  return (
    input.length > positionY &&
    input[positionY].length > positionX &&
    positionX >= 0 &&
    positionY >= 0
  );
}
function findWordsFromPosition(
  input: string[][],
  positionX: number,
  positionY: number,
  wordLength: number
): string[] {
  if (!isValidPosition(input, positionX, positionY)) {
    return [];
  }

  const currentChar = input[positionY][positionX];
  const words = Array(8).fill(currentChar);

  for (let i = 1; i < wordLength; i++) {
    words[0] += input[positionY]?.[positionX + i] ?? "";
    words[1] += input[positionY + i]?.[positionX + i] ?? "";
    words[2] += input[positionY + i]?.[positionX] ?? "";
    words[3] += input[positionY + i]?.[positionX - i] ?? "";
    words[4] += input[positionY]?.[positionX - i] ?? "";
    words[5] += input[positionY - i]?.[positionX - i] ?? "";
    words[6] += input[positionY - i]?.[positionX] ?? "";
    words[7] += input[positionY - i]?.[positionX + i] ?? "";
  }

  return words.flatMap((w) => [w, w.split("").reverse().join("")]);
}

function findWordMatches(word: string, input: string): number {
  // Transform input in a matrix of letters
  const charMap = input
    .split("\n")
    .filter((line: string) => line.length > 0)
    .map((line: string) => line.trim().split(""));

  let res = 0;
  for (let y = 0; y < charMap.length; y++) {
    for (let x = 0; x < charMap[y].length; x++) {
      if (charMap[y][x] === word[0]) {
        const words = findWordsFromPosition(charMap, x, y, word.length);
        res += words.filter((w) => w === word).length;
      }
    }
  }

  return res;
}

function day4Part1() {
  [
    `XMAS`,
    `SAMX`,
    `
X
M
A
S`,
    `
S
A
M
X`,
    `
S...
.A..
..M.
...X`,
    `
X...
.M..
..A.
...S`,
    `
...X
..M.
.A..
S...`,
    `
...S
..A.
.M..
X...`,
  ].forEach((test) => {
    assertEqual(findWordMatches("XMAS", test), 1, `Test ${test}`);
  });
  [`X MAS`].forEach((test) => {
    assertEqual(findWordMatches("XMAS", test), 0);
  });

  const testInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
  const expectedResultForTestInput = 18;
  assertEqual(findWordMatches("XMAS", testInput), expectedResultForTestInput);

  const input = loadFile(join(__dirname, "input.txt")).join("\n");
  return findWordMatches("XMAS", input);
}

function findXmas(input: string): number {
  // Transform input in a matrix of letters
  const charMap = input
    .split("\n")
    .filter((line: string) => line.length > 0)
    .map((line: string) => line.trim().split(""));

  let ret = 0;
  for (let y = 0; y < charMap.length; y++) {
    for (let x = 0; x < charMap[y].length; x++) {
      if (charMap[y][x] === "A") {
        const words = [
          `${charMap[y - 1]?.[x - 1] ?? ""}A${charMap[y + 1]?.[x + 1] ?? ""}`,
          `${charMap[y - 1]?.[x + 1] ?? ""}A${charMap[y + 1]?.[x - 1] ?? ""}`,
        ];
        if (words.every((w) => w === "MAS" || w === "SAM")) {
          ret++;
        }
      }
    }
  }
  return ret;
}

function day4Part2() {
  const testInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
  const expectedResultForTestInput = 9;
  assertEqual(
    findXmas(testInput),
    expectedResultForTestInput,
    "Exercise example"
  );

  const input = loadFile(join(__dirname, "input.txt")).join("\n");
  return findXmas(input);
}

function main() {
  console.log("Part 1 result:", day4Part1());
  console.log("Part 2 result:", day4Part2());
}
main();
