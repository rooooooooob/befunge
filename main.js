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
var stack;
var stringMode;
var sourcecode;
var originalSource;
var animId;
var output;

function initialise()
{

}

function run()
{
	var sourcebox = document.getElementById("id_sourcecode");
	originalSource = sourcebox.value.slice();
	sourcecode = originalSource.split("\n");
	const animate = document.getElementById("id_animate").value;
	
	row = 0;
	col = 0;
	dir = Dir.EAST;
	stack = []
	stringMode = false;
	output = "";
	
	if (animate)
	{
		document.getElementById("id_runbutton").disabled = true;
		document.getElementById("id_stopbutton").disabled = false;
		animId = setInterval(animatedStep, 100);
	}
	else
	{
		while (step()) {}
	}
}

function stop()
{
	clearInterval(animId);
	// restore original source, since we might've been using the box for animating
	document.getElementById("id_sourcecode").value = originalSource;
	document.getElementById("id_runbutton").disabled = false;
	document.getElementById("id_stopbutton").disabled = true
}

function animatedStep()
{
	if (!step())
	{
		stop();
	}
	render();
}

function step()
{
	// check to see if it will go on forever
	if ((dir == Dir.NORTH && row < 0) ||
		(dir == Dir.EAST && col >= sourcecode[row].length) ||
		(dir == Dir.WESt && col < 0) ||
		(dir == Dir.SOUTH && row >= sourcecode.length))
	{
		//alert("walked off in direction " + dir + " at (" + col + ", " + row + ")");
		return false;
	}
	//alert("going" + dir + " at (" + col + ", " + row + ")");
	// we can be out-of-bounds since sourcecode is a jagged array,
	// but eventually come back into bounds, so just keep walking like
	// it's an empty spot
	if (col < sourcecode[row].length)
	{
		const c = sourcecode[row][col];
		if (c >= '0' && c <= '9')
		{
			push(Number(c));
		}
		else if (stringMode)
		{
			if (c == '\"')
			{
				stringMode = false;
			}
			else
			{
				push(c.charCodeAt());
			}
		}
		else
		{
			switch (c)
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
				case '+':
					push(pop() + pop());
					break;
				case '-':
					push(pop() - pop());
					break;
				case '*':
					push(pop() * pop());
					break;
				case '/':
					const a = pop();
					const b = pop();
					if (a == 0)
					{
						push(userNumberInput());
					}
					else
					{
						push(Math.floor(b / a));
					}
					break;
				case '%':
					a = pop();
					b = pop();
					if (a == 0)
					{
						push(userNumberInput());
					}
					else
					{
						push(Math.floor(b % a));
					}
					break;
				case '!':
					push(pop() == 0 ? 1 : 0);
					break;
				case '`':
					push(pop() < pop() ? 1 : 0);
					break;
				case '?':
					const r = Math.floor(Math.random() * 4);
					switch (r)
					{
						case 0:
							dir = Dir.NORTH;
							break;
						case 1:
							dir = Dir.EAST;
							break;
						case 2:
							dir = Dir.WEST;
							break;
						case 3:
							dir = Dir.SOUTH;
							break;
						default:
							alert("invalid random number");
					}
					break;
				case '_':
					dir = (pop() == 0) ? Dir.EAST : Dir.WEST;
					break;
				case '|':
					dir = (pop() == 0) ? Dir.SOUTH : Dir.NORTH;
					break;
				case '\"':
					// assert(stringMode == false)
					stringMode = true;
					break;
				case ':':
					const dup = pop();
					push(dup);
					push(dup);
					break;
				case '\\':
					a = pop();
					b = pop();
					push(a);
					push(b);
					break;
				case '$':
					pop();
					break;
				case '.':
					output += pop().toString();
					break;
				case ',':
					output += String.fromCharCode(pop());
					break;
				case '#':
					move();
					break;
				case 'p':
					const y = pop();
					const x = pop();
					const v = pop();
					sourcecode[y][x] = String.fromCharCode(v);
					break;
				case 'g':
					y = pop();
					x = pop();
					push(sourcecode[y][x].charCodeAt());
					break;
				case '&':
					push(userNumberInput());
					break;
				case '~':
					push(userCharInput().charCodeAt());
					break;
				default:
					alert("died from a " + sourcecode[row][col] + " :(");
					return false;
			}
		}
	}
	move();
	return true;
}

function pop()
{
	if (stack.length == 0)
	{
		// this is the compliant behaviour for a befunge interpreter
		return 0;
	}
	return stack.pop();
}

function push(e)
{
	stack.push(e);
}

function move()
{
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
}

function render()
{
	var sourcebox = document.getElementById("id_sourcecode");
	var viewCode = "";
	for (var r = 0; r < sourcecode.length; ++r)
	{
		for (var c = 0; c < 80; ++c)
		{
			if (r == row && c == col)
			{
				viewCode += '@';
			}
			else if (c < sourcecode[r].length)
			{
				viewCode += sourcecode[r][c];
			}
			else
			{
				viewCode += ' ';
			}
		}
		viewCode += '\n';
	}
	sourcebox.value = viewCode;
	document.getElementById("id_output").value = "Stack: [" + stack + "]\nOutput:\n" + output;
}

// pulls from input queue, or if empty, 
function userNumberInput()
{
	// @TODO pull from queue instead of always querying
	var number;
	do
	{
		number = Number(prompt("Enter value", ""));
	}
	while (Number.isNaN(number));
	return number;
}

function userCharInput()
{
	// @todo implement
	return '!'
}