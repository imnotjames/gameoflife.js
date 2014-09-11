'use strict';

describe('Game of Life', function() {
	// This is more of a sanity check than anything!
	it('should construct correctly', function() {
		var game = new GameOfLife(10, 11);

		expect(game).toBeDefined();

		expect(game.getWidth()).toEqual(10);
		expect(game.getHeight()).toEqual(11);
	});

	// Check that inhabitants get added correctly
	it('should correctly set inhabitants', function() {
		var game = new GameOfLife(4, 4);

		game.spawnCell(1, 1);
		game.spawnCell(1, 2);

		game.commit();

		expect(game.getInhabitants().length).toEqual(2);
		expect(game.isCellAlive(1, 1)).toBeTruthy();
		expect(game.isCellAlive(1, 2)).toBeTruthy();
	});

	// Conway's game of life rules
	it('should kill lonely cells', function() {
		var game = new GameOfLife(4, 4);

		game.spawnCell(1, 1);

		game.step();

		expect(game.getInhabitants().length).toEqual(0);
	});

	it('should leave alone goldilocks cells (2 or 3 neighbors)', function() {
		var game = new GameOfLife(4, 4);

		game.spawnCell(1, 1);
		game.spawnCell(1, 2);
		game.spawnCell(2, 1);

		game.step();

		expect(game.isCellAlive(1, 1)).toBeTruthy();
		expect(game.isCellAlive(1, 2)).toBeTruthy();
		expect(game.isCellAlive(2, 1)).toBeTruthy();
	});

	it('should kill any overpopulated cells', function() {
		var game = new GameOfLife(4, 4);

		game.spawnCell(0, 0);
		game.spawnCell(0, 1);
		game.spawnCell(1, 1);
		game.spawnCell(1, 2);
		game.spawnCell(2, 1);

		game.step();

		expect(game.isCellAlive(0, 0)).toBeTruthy();
		expect(game.isCellAlive(0, 1)).toBeTruthy();
		expect(game.isCellAlive(1, 1)).not.toBeTruthy();
		expect(game.isCellAlive(1, 2)).toBeTruthy();
		expect(game.isCellAlive(2, 1)).toBeTruthy();
	});

	it('should reproduce into any cells with exactly three neighbors', function() {
		var game = new GameOfLife(4, 4);

		game.spawnCell(0, 0);
		game.spawnCell(0, 1);
		game.spawnCell(1, 2);

		game.step();

		expect(game.isCellAlive(1, 1)).toBeTruthy();
	});
});
