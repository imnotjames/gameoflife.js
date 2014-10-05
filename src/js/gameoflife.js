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

		var potentialSet = {};

		for (var i in inhabitants) {
			if (!inhabitants.hasOwnProperty(i)) {
				continue;
			}

			// i is a string for some reason
			i = +i;
			for (var j = 0; j < 9; j++) {
				var cellIndex = i + ((j % 3) - 1) + (width * (Math.floor(j / 3) - 1));

				potentialSet[cellIndex] = true;
			}
		}

		for (var i in potentialSet) {
			if (potentialSet.hasOwnProperty(i)) {
				potential.push(i);
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
		for (var i in inhabitants) {
			if (!inhabitants.hasOwnProperty(i) || inhabitants[i]) {
				continue;
			}

			transaction.push({
				index: i,
				alive: false
			});
		}
	};

	this.getInhabitants = function() {
		var coordinates = [];

		for (var i in inhabitants) {
			if (!inhabitants.hasOwnProperty(i) || !inhabitants[i]) {
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

		if (typeof position === "undefined") {
			return;
		}

		transaction.push({
			index: position,
			alive: true
		});
	};

	this.killCell = function(x, y) {
		var position = getIndex(x, y);

		if (typeof position === "undefined") {
			return;
		}

		transaction.push({
			index: position,
			alive: false
		});
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

		for(var i = 0; i < neighbors.length; i++) {
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

		for (var i = 0; i < transaction.length; i++) {
			inhabitants[transaction[i].index] = transaction[i].alive;
		}

		for (var i in inhabitants) {
			if (!inhabitants.hasOwnProperty(i)) {
				continue;
			}

			if (!inhabitants[i]) {
				delete inhabitants[i];
			}
		}

		transaction.length = 0;
	};

	this.step = function() {
		this.commit();

		var potential = getPotentialCells();

		for (var i = 0; i < potential.length; i++) {
			var cell = getCoordinates(potential[i]);

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
