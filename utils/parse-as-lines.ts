export function parseAsLines(
  input: string,
  {
    removeEmptyLines = true,
    trim = false,
  }: {
    /** Should the output be sanitized by removing empty lines? */
    removeEmptyLines?: boolean;
    /** Should the output be sanitized by trimming each line? */
    trim?: boolean;
  } = {}
): string[] {
  let lines = input.split("\n");

  if (removeEmptyLines) {
    lines = lines.filter((line) => line.trim().length);
  }
  if (trim) {
    lines = lines.map((line) => line.trim());
  }

  return lines;
}
