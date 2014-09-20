'use strict';

describe('Game of Life', function() {
	// As a cellular automaton
	// I want to follow the rules of Conway's Game of Life
	// So that we are able to simulate simple life

	var game;

	beforeEach(function() {
		game = new GameOfLife(5, 5);
	});

	// Scenario 1
	it('should kill lonely cells', function() {
		// Given that a cell is alive
		game.spawnCell(1, 1);

		// And that cell has no live neighbors
		game.commit();

		// When a simulation step has executed
		game.step();

		// Then that cell should die
		expect(game.getInhabitants().length).toEqual(0);
	});

	// Scenario 2
	it('should kill cells with only one neighbor', function() {
		// Given that a cell is alive
		game.spawnCell(1, 1);

		// And that cell has exactly one live neighbor
		game.spawnCell(1, 2);
		game.commit();

		// When a simulation step has executed
		game.step();

		// Then that cell should die
		expect(game.getInhabitants().length).toEqual(0);
	});

	// Scenario 3
	it('should leave cells with two neighbors alone', function() {
		// Given that a cell is alive
		game.spawnCell(1, 1);

		// And that cell has two live neighbors
		game.spawnCell(1, 2);
		game.spawnCell(2, 1);

		game.commit();

		// When a simulation step has executed
		game.step();

		// Then that cell should continue to live
		expect(game.isCellAlive(1, 1)).toBeTruthy();
	});

	// Scenario 4
	it('should leave cells with three neighbors alone', function() {
		// Given that a cell is alive
		game.spawnCell(1, 1);

		// And that cell has three live neighbors
		game.spawnCell(1, 2);
		game.spawnCell(2, 1);
		game.spawnCell(1, 0);

		game.commit();

		// When a simulation step has executed
		game.step();

		// Then that cell should continue to live
		expect(game.isCellAlive(1, 1)).toBeTruthy();
	});

	// Scenario 5
	it('should kill overpopulated cells', function() {
		// Given that a cell is alive
		game.spawnCell(1, 1);

		// And that cell has more than three live neighbors
		game.spawnCell(0, 0);
		game.spawnCell(0, 1);
		game.spawnCell(1, 2);
		game.spawnCell(2, 1);

		// When a simulation step has executed
		game.step();

		// Then that cell should continue to live
		expect(game.isCellAlive(1, 1)).not.toBeTruthy();
	});

	// Scenario 6
	it('should reproduce into any cells with exactly three neighbors', function() {
		// Given that a cell is dead
		game.killCell(1, 1);

		// And that cell has exactly three live neighbors
		game.spawnCell(0, 0);
		game.spawnCell(0, 1);
		game.spawnCell(1, 2);

		// When a simulation step has executed
		game.step();

		// Then that cell should be given life
		expect(game.isCellAlive(1, 1)).toBeTruthy();
	});
});
