'use strict';

describe('Game of Life', function() {
	// As a cellular automaton
	// I want to follow the rules of Conway's Game of Life
	// So that we are able to simulate simple life

	// Scenario 1
	it('should initiate with the correct cells before running', function() {
		// Given that a Game of Life object is instantiated
		var game = new GameOfLife(5, 5);

		// When it is given a list of live cells
		game.spawnCell(1, 1);
		game.spawnCell(1, 2);
		game.commit();

		// Then those cells should be the only live cells
		expect(game.getInhabitants().length).toEqual(2);
		expect(game.isCellAlive(1, 1)).toBeTruthy();
		expect(game.isCellAlive(1, 2)).toBeTruthy();
	});

	// Scenario 2
	it('should kill lonely cells', function() {
		// Given that a Game of Life object is instantiated
		var game = new GameOfLife(4, 4);

		// Given that a cell is alive
		game.spawnCell(1, 1);

		// And that cell has fewer than two live neighbors
		game.commit();

		// When a simulation step has executed
		game.step();

		// Then that cell should die
		expect(game.getInhabitants().length).toEqual(0);
	});

	// Scenario 3
	it('should leave goldilocks cells alone', function() {
		// Given that a Game of Life object is instantiated
		var game = new GameOfLife(4, 4);

		// And a cell is alive
		game.spawnCell(1, 1);

		// And that cell has two or three live neighbors
		game.spawnCell(1, 2);
		game.spawnCell(2, 1);

		game.commit();

		// When a simulation step has executed
		game.step();

		// Then that cell should continue to live
		expect(game.isCellAlive(1, 1)).toBeTruthy();
	});

	// Scenario 4
	it('should kill overpopulated cells', function() {
		// Given that a Game of Life object is instantiated
		var game = new GameOfLife(4, 4);

		// And a cell is alive
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

	// Scenario 5
	it('should reproduce into any cells with exactly three neighbors', function() {
		// Given that a Game of Life object is instantiated
		var game = new GameOfLife(4, 4);

		// And a cell is dead
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
