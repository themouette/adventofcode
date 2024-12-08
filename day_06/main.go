package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func loadRawFile(fileName string) string {
	data, err := os.ReadFile(fileName)
	if err != nil {
		panic(err)
	}
	return strings.TrimSpace(string(data))
}

func removeEmptyLines(input string) [][]string {
	lines := strings.Split(input, "\n")
	var result [][]string
	for _, line := range lines {
		trimmedLine := strings.TrimSpace(line)
		if trimmedLine != "" {
			result = append(result, strings.Split(trimmedLine, ""))
		}
	}
	return result
}

type Position struct {
	X, Y int
}

func getGuardPosition(data [][]string) Position {
	for y, row := range data {
		for x, tile := range row {
			if tile == "^" {
				return Position{X: x, Y: y}
			}
		}
	}
	panic("Guard position not found")
}

func isWithinBounds(data [][]string, position Position) bool {
	return position.Y >= 0 && position.Y < len(data) && position.X >= 0 && position.X < len(data[position.Y])
}

func turnRight(direction Position) Position {
	return Position{X: -direction.Y, Y: direction.X}
}

func executePart1(input string) int {
	data := removeEmptyLines(input)
	guardPosition := getGuardPosition(data)
	direction := Position{X: 0, Y: -1}
	walkedTiles := 1

	for isWithinBounds(data, guardPosition) {
		nextPosition := Position{X: guardPosition.X + direction.X, Y: guardPosition.Y + direction.Y}

		if !isWithinBounds(data, nextPosition) {
			return walkedTiles
		}

		nextTile := data[nextPosition.Y][nextPosition.X]
		if nextTile == "#" {
			direction = turnRight(direction)
		} else {
			if data[guardPosition.Y][guardPosition.X] != "X" {
				walkedTiles++
			}
			data[guardPosition.Y][guardPosition.X] = "X"
			guardPosition = nextPosition
		}
	}
	return walkedTiles
}

func canExitMaze(data [][]string, guardPosition Position, guardDirection Position) bool {
	position := guardPosition
	direction := guardDirection
	turns := make(map[string]bool)

	for isWithinBounds(data, position) {
		nextPosition := Position{X: position.X + direction.X, Y: position.Y + direction.Y}

		if !isWithinBounds(data, nextPosition) {
			return true
		}

		nextTile := data[nextPosition.Y][nextPosition.X]
		if nextTile == "#" || nextTile == "O" {
			command := fmt.Sprintf("%d,%d:%d,%d", position.X, position.Y, direction.X, direction.Y)
			direction = turnRight(direction)
			if turns[command] {
				return false
			}
			turns[command] = true
		} else {
			data[position.Y][position.X] = "X"
			position = nextPosition
		}
	}
	return false
}

func executePart2(input string) int {
	data := removeEmptyLines(input)
	initialPosition := getGuardPosition(data)
	position := initialPosition
	direction := Position{X: 0, Y: -1}
	successfulChanges := make(map[string]bool)

	for isWithinBounds(data, position) {
		nextPosition := Position{X: position.X + direction.X, Y: position.Y + direction.Y}

		if !isWithinBounds(data, nextPosition) {
			break
		}

		nextTile := data[nextPosition.Y][nextPosition.X]
		if nextTile == "#" || nextTile == "O" {
			direction = turnRight(direction)
		} else {
			nextData := make([][]string, len(data))
			for i := range data {
				nextData[i] = append([]string{}, data[i]...)
			}
			nextData[nextPosition.Y][nextPosition.X] = "O"
			if !canExitMaze(nextData, initialPosition, Position{X: 0, Y: -1}) {
				key := fmt.Sprintf("%d,%d", nextPosition.X, nextPosition.Y)
				successfulChanges[key] = true
			}
			position = nextPosition
		}
	}

	return len(successfulChanges)
}

func main() {
	inputPath := filepath.Join(".", "input.txt")
	input := loadRawFile(inputPath)

	fmt.Println("Part 1:", executePart1(input))
	fmt.Println("Part 2:", executePart2(input))
}
