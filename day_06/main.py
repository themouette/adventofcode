import os

def load_raw_file(file_name):
    with open(file_name, 'r') as file:
        return file.read().strip()

def remove_empty_lines(input):
    return [list(line) for line in input.split("\n") if line.strip()]

def get_guard_position(data):
    for y, row in enumerate(data):
        if "^" in row:
            x = row.index("^")
            return {"x": x, "y": y}
    raise ValueError("Guard position not found")

def is_within_bounds(data, position):
    return (
        0 <= position["y"] < len(data) and
        0 <= position["x"] < len(data[position["y"]])
    )

def turn_right(direction):
    return {"x": -direction["y"], "y": direction["x"]}

def execute_part1(input):
    data = remove_empty_lines(input)
    guard_position = get_guard_position(data)
    direction = {"x": 0, "y": -1}
    walked_tiles = 1

    while is_within_bounds(data, guard_position):
        next_position = {
            "x": guard_position["x"] + direction["x"],
            "y": guard_position["y"] + direction["y"]
        }

        if not is_within_bounds(data, next_position):
            return walked_tiles

        next_tile = data[next_position["y"]][next_position["x"]]
        if next_tile == "#":
            direction = turn_right(direction)
        else:
            if data[guard_position["y"]][guard_position["x"]] != "X":
                walked_tiles += 1
            data[guard_position["y"]][guard_position["x"]] = "X"
            guard_position = next_position

    return walked_tiles

def can_exit_maze(data, guard_position, guard_direction):
    position = guard_position.copy()
    direction = guard_direction.copy()
    turns = set()

    while is_within_bounds(data, position):
        next_position = {
            "x": position["x"] + direction["x"],
            "y": position["y"] + direction["y"]
        }

        if not is_within_bounds(data, next_position):
            return True

        next_tile = data[next_position["y"]][next_position["x"]]
        if next_tile in ["#", "O"]:
            command = f'{position["x"]},{position["y"]}:{direction["x"]},{direction["y"]}'
            direction = turn_right(direction)
            if command in turns:
                return False
            turns.add(command)
        else:
            data[position["y"]][position["x"]] = "X"
            position = next_position

    return False

def execute_part2(input):
    data = remove_empty_lines(input)
    initial_position = get_guard_position(data)
    position = initial_position.copy()
    direction = {"x": 0, "y": -1}
    successful_changes = set()

    while is_within_bounds(data, position):
        next_position = {
            "x": position["x"] + direction["x"],
            "y": position["y"] + direction["y"]
        }

        if not is_within_bounds(data, next_position):
            break

        next_tile = data[next_position["y"]][next_position["x"]]
        if next_tile in ["#", "O"]:
            direction = turn_right(direction)
        else:
            next_data = [row[:] for row in data]
            next_data[next_position["y"]][next_position["x"]] = "O"
            if not can_exit_maze(next_data, initial_position, {"x": 0, "y": -1}):
                successful_changes.add(f'{next_position["x"]},{next_position["y"]}')
            position = next_position

    return len(successful_changes)

if __name__ == "__main__":
    input_path = os.path.join(".", "input.txt")
    input = load_raw_file(input_path)

    example_input = """....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#..."""

    print("Part 1:", execute_part1(input))
    print("Part 2:", execute_part2(input))

