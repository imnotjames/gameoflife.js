var GameOfLife = function(width, height, loops) {
	var width = parseInt(width);
	var height = parseInt(height);

	var inhabitants = [];
	var transaction = [];

	var loops = loops !== false;

	var getCoordinates = function(index) {
		index = +index;

		var maximum = width * height;

		if (loops) {
			index += maximum;
			index %= maximum;
		} else if (index < 0 || index >= maximum) {
			return;
		}

		return {
			x: index % width,
			y: Math.floor(index / width)
		};
	};

	var getIndex = function(x, y) {
		if (loops) {
			x += width;
			x = x % width;

			y += height;
			y = y % height;
		} else if (x < 0 || x >= width || y < 0 || y >= height) {
			return;
		}

		return x + (width * y);
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

	this.clear = function() {
		for (var position in inhabitants) {
			if (inhabitants.hasOwnProperty(position) && inhabitants[position]) {
				transaction[position] = false;
			}
		}
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

		return inhabitants[position] == true;
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

		transaction.splice(0);
	};

	this.step = function() {
		this.commit();

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
