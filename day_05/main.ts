import { join } from "path";
import { loadRawFile, assertEqual, removeEmptyLines } from "../utils";

const input = loadRawFile(join(__dirname, "input.txt"));

const exampleInput = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

const prepareInput = (input: string): [[number, number][], number[][]] => {
  const [constraints = "", updates = ""] = input.split("\n\n", 2);

  return [
    removeEmptyLines(constraints).map((line) =>
      line.split("|").map(Number)
    ) as [number, number][],
    removeEmptyLines(updates).map((line) => line.split(",").map(Number)),
  ];
};

const satisfiesConstraint = (
  constraint: [number, number],
  update: number[]
) => {
  const [before, after] = constraint;
  let beforeIndexes: number[] = [];
  let afterIndexes: number[] = [];
  update.forEach((page, index) => {
    if (page === before) {
      beforeIndexes.push(index);
    }
    if (page === after) {
      afterIndexes.push(index);
    }
  });

  // Not all pages are present
  if (beforeIndexes.length === 0 || afterIndexes.length === 0) {
    return true;
  }

  // Both pages are present
  return afterIndexes[0] > beforeIndexes[beforeIndexes.length - 1];
};

assertEqual(satisfiesConstraint([1, 2], [1, 2]), true, "satisfiesConstraint 1");
assertEqual(
  satisfiesConstraint([1, 2], [2, 1]),
  false,
  "satisfiesConstraint 2"
);
assertEqual(
  satisfiesConstraint([1, 2], [2, 3, 4]),
  true,
  "satisfiesConstraint missing before"
);
assertEqual(
  satisfiesConstraint([1, 2], [1, 3, 4]),
  true,
  "satisfiesConstraint missing after"
);
assertEqual(
  satisfiesConstraint([1, 2], [1, 3, 2]),
  true,
  "satisfiesConstraint ok"
);
assertEqual(
  satisfiesConstraint([1, 2], [2, 3, 1]),
  false,
  "satisfiesConstraint true"
);
assertEqual(
  satisfiesConstraint([1, 2], [2, 3, 1, 2]),
  false,
  "satisfiesConstraint multiple occurences"
);

const isConstraintsCompliant =
  (constraints: [number, number][]) =>
  (update: number[]): boolean => {
    return constraints.every((constraint) =>
      satisfiesConstraint(constraint, update)
    );
  };

const executePart1 = (input: string) => {
  const [constraints, updates] = prepareInput(input);
  const compliantUpdates = updates.filter(isConstraintsCompliant(constraints));
  // Sum of all compliant updates pivot
  return compliantUpdates.reduce((acc, update) => {
    const pivot = Math.floor(update.length / 2);
    return acc + update[pivot];
  }, 0);
};

function todayPart1() {
  assertEqual(executePart1(exampleInput), 143, "part 1 input");
  return executePart1(input);
}

function fixUpdate(
  update: number[],
  constraints: [number, number][]
): number[] {
  return update.sort((a, b) => {
    for (let [before, after] of constraints) {
      if (a === before && b === after) {
        return -1;
      }
      if (a === after && b === before) {
        return 1;
      }
    }
    console.log("❌ no constraint found", "a", a, "b", b);
    return 0;
  });
}

function executePart2(input: string) {
  const [constraints, updates] = prepareInput(input);
  const isCompliant = isConstraintsCompliant(constraints);
  const compliantUpdates = updates
    .filter((update) => !isCompliant(update))
    .map((update) => {
      return fixUpdate(update, constraints);
    });
  // Sum of all compliant updates pivot
  return compliantUpdates.reduce((acc, update) => {
    const pivot = Math.floor(update.length / 2);
    return acc + update[pivot];
  }, 0);
}

function todayPart2() {
  assertEqual(executePart2(exampleInput), 123, "part 2 input");
  return executePart2(input);
}

function main() {
  console.log("Part 1", todayPart1());
  console.log("Part 2", todayPart2());
}
main();
