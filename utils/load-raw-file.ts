import { readFileSync } from "fs";

export function loadRawFile(fileName: string = "input.txt"): string {
  return readFileSync(fileName, "utf8").trim();
}
