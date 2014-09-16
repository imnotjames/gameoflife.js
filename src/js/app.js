window.onload = function() {
	var canvas = document.getElementById('nodes');

	if (canvas.width < document.documentElement.clientWidth) {
		canvas.width = Math.floor(document.documentElement.clientWidth / 1.5);
	}

	if (canvas.height < document.documentElement.clientHeight) {
		canvas.height = Math.floor(document.documentElement.clientHeight / 1.5);
		canvas.height = Math.floor(document.documentElement.clientHeight / 1.5);
	}

	var context = canvas.getContext('2d');

	var width = canvas.width;
	var height = canvas.height;

	var nodeRadius = 15;

	var gameOfLife = new GameOfLife(width / 5, height / 5);

	var helper = new GameOfLifeHelper(gameOfLife);

	helper.drawSchickShip(20, 20, 1);
	helper.drawSchickShip(50, 20, 3);

	gameOfLife.commit();

	setInterval(
		function() {
			gameOfLife.step();
			gameOfLife.commit();
		},
		200
	);

	function render() {
		context.clearRect (0, 0, canvas.width, canvas.height);

		context.fillStyle = 'rgba(30, 30, 30, 0.5)';
		context.strokeStyle = 'rgb(30, 30, 30)';

		var nodes = gameOfLife.getInhabitants();

		for (var i in nodes) {
			context.beginPath();

			context.arc(
				(nodes[i].x / gameOfLife.getWidth()) * canvas.width,
				(nodes[i].y / gameOfLife.getHeight()) * canvas.height,
				Math.floor(((1 / gameOfLife.getWidth()) * canvas.width) * 0.5) / 2,
				0,
				2 * Math.PI,
				false
			);

			context.fill();
			context.stroke();
		}
	};

	(function renderLoop() {
		var thisTick = Date.now();

		var tickDelta = thisTick - this.lastTick;

		var tickWait = (1000 / 15) - tickDelta;

		this.lastTick = thisTick + (tickWait ? tickWait : 0);

		setTimeout(
			function() {
				render();

				(
					window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					function(callback){ window.setTimeout(callback, 1000 / 60); }
				)(renderLoop);
			},
			tickWait
		);
	})();
};
