import { join } from "path";
import { loadDataAsRows } from "../utils";

function loadData() {
  const fileName = join(__dirname, "input.txt");
  return loadDataAsRows(fileName);
}

function loadTestData() {
  return [
    [7, 6, 4, 2, 1],
    [1, 2, 7, 8, 9],
    [9, 7, 6, 2, 1],
    [1, 3, 2, 4, 5],
    [8, 6, 4, 4, 1],
    [1, 3, 6, 7, 9],
  ];
}

/**
 * a report only counts as safe if both of the following are true:
 *
 * - The levels are either all increasing or all decreasing.
 * - Any two adjacent levels differ by at least one and at most three.
 */
function isReportSafe(report: number[]): boolean {
  let isIncreasing = false;
  let isDecreasing = false;
  let prevLevel = report[0];

  for (let item of report.slice(1)) {
    const delta = Math.abs(item - prevLevel);
    if (delta > 3 || delta < 1) {
      // Adjacent levels differ by more than 3
      return false;
    }

    if (item > prevLevel) {
      isIncreasing = true;
    }
    if (item < prevLevel) {
      isDecreasing = true;
    }
    if (isIncreasing && isDecreasing) {
      // Both increasing and decreasing
      return false;
    }
    prevLevel = item;
  }

  return true;
}

function isReportSafeWithProblemDampener(report: number[]): boolean {
  // problem dampener test any combination, with one value removed from the
  // report
  if (isReportSafe(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    // copy report
    const testReport = report.slice();
    // remove value at index i
    testReport.splice(i, 1);
    if (isReportSafe(testReport)) {
      return true;
    }
  }
  return false;
}

function day2Part1WithTestData() {
  const testData = loadTestData();
  const safeReports = testData
    .map((r, i) => {
      console.log(`Report ${i}: ${isReportSafe(r)}`);
      return r;
    })
    .filter(isReportSafe);
  return safeReports.length;
}

function day2Part2WithTestData() {
  const testData = loadTestData();
  const safeReports = testData
    .map((r, i) => {
      console.log(`Report ${i}: ${isReportSafe(r)}`);
      return r;
    })
    .filter(isReportSafeWithProblemDampener);
  return safeReports.length;
}

function mainPart1() {
  const reports = loadData();

  const safeReports = reports.filter(isReportSafe);
  return safeReports.length;
}

function mainPart2() {
  const reports = loadData();

  const safeReports = reports.filter(isReportSafeWithProblemDampener);
  return safeReports.length;
}

function testIsReportSafe() {
  const safeReports = [
    [1, 2, 3, 4, 5],
    [5, 4, 3],
    [1, 3, 4, 7, 9],
  ];

  safeReports.forEach((report) => {
    if (!isReportSafe(report)) {
      console.log("Failed test case", report);
    }
  });

  const unsafeReports = [
    [1, 2, 3, 3], // increasing then same
    [5, 4, 3, 4], // decreasing then increasing
    [1, 3, 4, 8, 10], // increasing by more than 3
    [9, 7, 6, 2, 1], // decreasing by more than 3
  ];

  unsafeReports.forEach((report) => {
    if (isReportSafe(report)) {
      console.log("Failed test case unsafe", report);
    }
  });
}

testIsReportSafe();
console.log("test case part 1", day2Part1WithTestData());
console.log("With input data, part 1", mainPart1());
console.log("test case part 2", day2Part2WithTestData());
console.log("With input data, part 2", mainPart2());
