var size = 15;
var grid = new Array(size, size);
for (i = 0 ; i < size ; i++)
	grid[i] = new Array(size);

var position;
var lookTo;
/* 0 -> top | 1 -> right | 2 -> down | 3 -> left*/

var ant = new Image();
ant.src = './img/ant.png';

/**
 * Reset the grid
 */
function reset() {
	document.getElementById("stop").disabled = true;

	for (i = 0 ; i < size ; i++)
		for (j = 0 ; j < size ; j++)
			grid[i][j] = false
			
	position = [Math.floor(size/2), Math.floor(size/2)];
	lookTo = 0;
	
	document.getElementById("nbiterations").innerHTML = 0;
	
	draw();
}

/**
 * Draw the grid based on the data
 */
function draw() {
	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	
	var cellSize = canvas.offsetWidth / size
	
	ant.Width = ant.Height = (80/100) * cellSize;
	
	// Print the grid
			
	for (i = 0 ; i < size ; i++) {
		x = i * cellSize;
		for (j = 0 ; j < size ; j++){
			y = j * cellSize;
			
			drawCell(context, cellSize, x, y);
			fillCell(context, cellSize, x, y);
			drawAnt(context, cellSize, i, j, x, y);
		}
	}
	context.strokeStyle = "#000000";
	context.stroke();
	
	context.closePath();
}

/**
 * Draw a cell except for the ones on the left and the top
 * @param context
 * @param cellSize
 * @param x
 * @param y
 */
function drawCell(context, cellSize, x, y) {
	if(x != 0) {
		context.moveTo(x, y);
		context.lineTo(x, y + cellSize);
	}
	if(y != 0) {
		context.moveTo(x, y);
		context.lineTo(x + cellSize, y);
	}
}

/**
 * Fill the cell black if needed
 * @param context
 * @param cellSize
 * @param x
 * @param y
 */
function fillCell(context, cellSize, x, y) {
	if(grid[i][j])
		context.fillRect(x, y, cellSize, cellSize);
}

/**
 * Draw the ant if needed
 * @param context
 * @param cellSize
 * @param x
 * @param y
 */
function drawAnt(context, cellSize, i, j, x, y) {
	if(position[0] == i && position[1] == j){
		if(lookTo != 0) {
			imgPosX = -ant.Width/2;
			imgPosY = -ant.Height/2;
			context.save();
			context.translate(x + cellSize/2, y + cellSize/2);
			var rotation;
			if(lookTo == 1)
				rotation = 90 * Math.PI / 180;
			else if(lookTo == 2)
				rotation = 180 * Math.PI / 180;
			else if(lookTo == 3)
				rotation = 270 * Math.PI / 180;
			
			context.rotate(rotation);
			context.drawImage(ant, imgPosX, imgPosY, ant.Width, ant.Height);
			context.restore();
		} else {
			imgPosX = x + (cellSize - ant.Width)/2;
			imgPosY = y + (cellSize - ant.Height)/2;
			context.drawImage(ant, imgPosX, imgPosY, ant.Width, ant.Height);
		}
	}
}

/**
 * Unleash the ant
 */
function launch() {
	reset();
	document.getElementById("stop").disabled = false;
	document.getElementById("reset").disabled = true;
	
	for(iterate = 1 ; iterate <= 100 ; iterate++) {
		isWhite = !grid[position[0]][position[1]];
		if(isOnBorder(isWhite, lookTo)){
			document.getElementById("stop").disabled = true;
			document.getElementById("reset").disabled = false;
			break;
		}
		
		// White
		if(isWhite) {
			grid[position[0]][position[1]] = true;
			
			if(lookTo == 0)
				position[0] = position[0] + 1;
			else if(lookTo == 1)
				position[1] = position[1] + 1;
			else if(lookTo == 2)
				position[0] = position[0] - 1;
			else if(lookTo == 3)
				position[1] = position[1] - 1;
			
			lookTo = (lookTo + 1) % 4;
		}
		
		// Black
		else {
			grid[position[0]][position[1]] = false;
			
			if(lookTo == 0)
				position[0] = position[0] - 1;
			else if(lookTo == 1)
				position[1] = position[1] - 1;
			else if(lookTo == 2)
				position[0] = position[0] + 1;
			else if(lookTo == 3)
				position[1] = position[1] + 1;
			
			lookTo = (lookTo + 3) % 4;
		}
		draw();
		
		document.getElementById("nbiterations").innerHTML = iterate;
		
	}
}

/**
 * Unleash the ant
 */
function stop() {
	document.getElementById("stop").disabled = true;
	document.getElementById("reset").disabled = false;
}


function isOnBorder(isWhite, lookTo) {
	if(isWhite) {
		if(lookTo == 0 && position[0] == size - 1) return true;
		else if(lookTo == 1 && position[1] == size - 1) return true;
		else if(lookTo == 2 && position[0] == 0) return true;
		else if(lookTo == 3 && position[1] == 0) return true;
	} else {
		if(lookTo == 0 && position[0] == 0) return true;
		else if(lookTo == 1 && position[1] == 0) return true;
		else if(lookTo == 2 && position[0] == size - 1) return true;
		else if(lookTo == 3 && position[1] == size - 1) return true;
	}
}