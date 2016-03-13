"use strict";

const Dir = {
	NORTH : "north",
	EAST  : "east",
	WEST  : "west",
	SOUTH : "south"
};

var row;
var col;
var dir;
var sourcecode;

function initialise()
{

}

function run()
{
	sourcecode = document.getElementById("id_sourceocde").value.split("");
	alert(sourcecode);
	const animate = document.getElementById("id_animate").value;
	
	row = 0;
	col = 0;
	dir = Dir.EAST;
	while (step())
	{
		if (animate)
		{
			render();
		}
	}
	if (animate)
	{
		render();
	}
}

function step()
{
	// check to see if it will go on forever
	if ((dir == Dir.NORTH && row < 0) ||
		(dir == Dir.EAST && col >= sourcecode[row].length) ||
		(dir == Dir.WESt && col < 0) ||
		(dir == Dir.SOUTH && row >= sourcecode.length))
	{
		return false;
	}
	
	// we can be out-of-bounds since sourcecode is a jagged array,
	// but eventually come back into bounds, so just keep walking like
	// it's an empty spot
	if (sourcecode[row].length <= col)
	{
		switch (sourecode[row][col])
		{
			case ' ':
				// empty space - just keep walking
			case '^':
				dir = Dir.NORTH;
				break;
			case '>':
				dir = Dir.EAST;
				break;
			case '<':
				dir = Dir.WEST;
				break;
			case 'v':
				dir = Dir.SOUTH;
				break;
			default:
				//crash
				return false;
		}
	}
	switch (dir)
	{
		case Dir.NORTH:
			--row;
			break;
		case Dir.EAST:
			++col;
		case Dir.WEST:
			--col;
		case Dir.SOUTH:
			++row;
	}
	alert("x = " + col + ";  y = " + row);
	return true;
}

function render()
{
	
}