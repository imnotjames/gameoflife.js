var GameOfLife = function(width, height) {
	var width = width;
	var height = height;

	var inhabitants = [];
	var transaction = [];

	var getCoordinates = function(index) {
		if (index < 0 || index >= width * height) {
			return;
		}

		return {
			x: index % width,
			y: Math.floor(index / width)
		};
	};

	var getIndex = function(x, y) {
		var index = x + (width * y);

		if (index < 0 || index >= width * height) {
			return;
		}

		return index;
	};

	var getPotentialCells = function() {
		var potential = [];

		for (var i in inhabitants) {
			// i is a string for some reason
			i = +i;
			for (var j = 0; j < 9; j++) {
				var cellIndex = i + ((j % 3) - 1) + (width * (Math.floor(j / 3) - 1));

				potential[cellIndex] = potential[cellIndex] || cellIndex == i;
			}
		}

		return potential;
	};

	this.getWidth = function() {
		return width;
	};

	this.getHeight = function() {
		return height;
	};

	this.getInhabitants = function() {
		var coordinates = [];

		for (var i in inhabitants) {
			if (!inhabitants[i]) {
				continue;
			}

			coordinates.push(
				getCoordinates(i)
			);
		}

		return coordinates;
	};

	this.isCellAlive = function(x, y) {
		var position = getIndex(x, y);

		return inhabitants[position];
	};

	this.spawnCell = function(x, y) {
		var position = getIndex(x, y);

		if (typeof position !== "undefined" && !inhabitants[position]) {
			transaction[position] = true;
		}
	};

	this.killCell = function(x, y) {
		var position = getIndex(x, y);

		if (typeof position !== "undefined" && inhabitants[position]) {
			transaction[position] = false;
		}
	};

	this.getNeighbors = function(x, y) {
		var neighbors = [];

		for(var i = 0; i < 9; i++) {
			var iX = (i % 3) - 1;
			var iY = Math.floor(i / 3) - 1;

			if (iX == 0 && iY == 0) {
				continue;
			}

			neighbors.push({
				x: iX + x,
				y: iY + y
			});
		}

		return neighbors;
	};

	this.countNeighbors = function(x, y) {
		var count = 0;

		var neighbors = this.getNeighbors(x, y);

		for(var i in neighbors) {
			var neighbor = neighbors[i];

			if (this.isCellAlive(neighbor.x, neighbor.y)) {
				count++;
			}
		}

		return count;
	};

	this.commit = function() {
		if (transaction.length == 0) {
			return;
		}

		for (var i in transaction) {
			if (transaction[i]) {
				inhabitants[i] = true;
			} else {
				inhabitants[i] = false;
			}
		}

		for (var i in inhabitants) {
			if (!inhabitants[i]) {
				delete inhabitants[i];
			}
		}

		transaction.length = 0;
	};

	this.step = function() {
		var potential = getPotentialCells();

		for (var i in potential) {
			var cell = getCoordinates(i);

			if (!cell) {
				continue;
			}

			var neighborCount = this.countNeighbors(cell.x, cell.y);

			if (neighborCount < 2) {
				this.killCell(cell.x, cell.y);
			} else if (neighborCount > 3) {
				this.killCell(cell.x, cell.y);
			} else if (neighborCount == 3) {
				this.spawnCell(cell.x, cell.y);
			}
		}

		this.commit();
	};
};
