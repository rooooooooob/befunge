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
	var sourcebox = document.getElementById("id_sourceocde");
	const originalSource = sourcebox.value;
	sourcecode = originalSource.split("\n");
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
	// restore original source, since we might've been using the box for animating
	sourcebox.value = originalSource;
}

function step()
{
	// check to see if it will go on forever
	if ((dir == Dir.NORTH && row < 0) ||
		(dir == Dir.EAST && col >= sourcecode[row].length) ||
		(dir == Dir.WESt && col < 0) ||
		(dir == Dir.SOUTH && row >= sourcecode.length))
	{
		alert("walked off in direction " + dir + " at (" + col + ", " + row + ")");
		return false;
	}
	alert("going" + dir + " at (" + col + ", " + row + ")");
	// we can be out-of-bounds since sourcecode is a jagged array,
	// but eventually come back into bounds, so just keep walking like
	// it's an empty spot
	if (col < sourcecode[row].length)
	{
		switch (sourcecode[row][col])
		{
			case ' ':
				// empty space - just keep walking
				break;
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
			case '@': // end program
				return false;
			default:
				//crash
				//alert("died from a " + sourcecode[row][col] + " :(");
				//return false;
		}
	}
	switch (dir)
	{
		case Dir.NORTH:
			--row;
			break;
		case Dir.EAST:
			++col;
			break;
		case Dir.WEST:
			--col;
			break;
		case Dir.SOUTH:
			++row;
			break;
	}
	return true;
}

function render()
{
	var sourcebox = document.getElementById("id_sourceocde");
	var output = "";
	for (var r = 0; r < sourcecode.length; ++r)
	{
		for (var c = 0; c < 80; ++c)
		{
			if (r == row && c == col)
			{
				output += '@';
			}
			else if (c < sourcecode[r].length)
			{
				output += sourcecode[r][c];
			}
			else
			{
				output += ' '
			}
		}
		output += '\n';
	}
	sourcebox.value = output;
}