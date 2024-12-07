#!/usr/bin/env ts-node

import { readFileSync } from "node:fs";

function parseInput() {
  const input = readFileSync("input.txt", "utf8").trim();
  const list_1: number[] = [];
  const list_2: number[] = [];

  input.split("\n").forEach((line: string) => {
    const [num1, num2] = line.split(/\D+/).filter((num) => num !== "");
    list_1.push(parseInt(num1));
    list_2.push(parseInt(num2));
  });

  return [list_1, list_2];
}

function sumOfDistance(list_1: number[], list_2: number[]) {
  return list_1.reduce((acc, num, index) => {
    return acc + Math.abs(list_2[index] - num);
  }, 0);
}

function similarityScore(list_1: number[], list_2: number[]) {
  const list2ByCount = list_2.reduce((acc, num) => {
    acc[num] = num in acc ? acc[num] + 1 : 1;
    return acc;
  }, {} as Record<number, number>);

  return list_1.reduce((acc, num) => {
    return acc + num * (list2ByCount[num] ?? 0);
  }, 0);
}

function main() {
  const [list_1, list_2] = parseInput();
  // const list_1 = [3, 4, 2, 1, 3, 3];
  // const list_2 = [4, 3, 5, 3, 9, 3];

  // Sort lists by ascending order
  list_1.sort((a, b) => a - b);
  list_2.sort((a, b) => a - b);

  // return sumOfDistance(list_1, list_2);
  return similarityScore(list_1, list_2);
}

console.log(main());
