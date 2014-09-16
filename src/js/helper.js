var GameOfLifeHelper = function (gameOfLife) {
	var gameOfLife = gameOfLife;

	this.flip = function(lines, horizontal) {
		if (horizontal) {
			for (var line in lines) {
				lines[line] = lines[line].split("").reverse().join("");
			}
		} else {
			lines = lines.reverse();
		}

		return lines;
	};

	this.rotate = function(lines, counterClockwise) {
		var newLines = [];

		if (counterClockwise) {
			lines = this.flip(this.flip(lines, true), false);
		}

		for (var l in lines) {
			var line = lines[l].split("");

			for (var c in line) {
				if (!newLines[c]) {
					newLines[c] = "";
				}

				newLines[c] = line[c] + newLines[c];
			}
		}

		return newLines;
	};

	this.drawLines = function(xOffset, yOffset, lines) {
		if (typeof lines == 'string') {
			lines = [lines];
		}

		var x = xOffset;
		var y = yOffset;

		for (var i in lines) {
			line = lines[i].split("");

			for (var j in line) {
				if (line[j] == ' ') {
					gameOfLife.killCell(x, y);
				} else {
					gameOfLife.spawnCell(x, y);
				}

				x++;
			}

			x = xOffset;

			y++;
		}
	};

	this.drawPulsar = function(x, y) {
		this.drawLines(x, y, [
			'               ',
			'   XXX   XXX   ',
			'               ',
			' X    X X    X ',
			' X    X X    X ',
			' X    X X    X ',
			'   XXX   XXX   ',
			'              ',
			'   XXX   XXX   ',
			' X    X X    X ',
			' X    X X    X ',
			' X    X X    X ',
			'               ',
			'   XXX   XXX   ',
			'               ',
		]);
	};

	this.drawGlider = function(x, y, direction) {
		var lines = [
			'  X',
			'X X',
			' XX'
		];

		for (i = 0; i < direction; i++) {
			lines = this.rotate(lines);
		}

		this.drawLines(x, y, lines);
	}

	this.drawSchickShip = function(x, y, direction) {
		var lines = [
			'                       ',
			'  L   L                ',
			' L                     ',
			' L    L                ',
			' LSHIP         XX      ',
			'        PUF     XX     ',
			'        PU FF      TAG ',
			'        PUF     XX     ',
			' LSHIP         XX      ',
			' L    L                ',
			' L                     ',
			'  L   L                ',
			'                       ',
		];

		for (i = 0; i < direction; i++) {
			lines = this.rotate(lines);
		}

		this.drawLines(x, y, lines);
	}
};
