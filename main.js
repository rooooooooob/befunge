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
		if (c >= '0' && c < '9')
		{
			stack.push(Number(c));
		}
		else if (stringMode)
		{
			if (c == '\"')
			{
				stringMode = false;
			}
			else
			{
				stack.push(c.charCodeAt());
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
					stack.push(stack.pop() + stack.pop());
					break;
				case '-':
					stack.push(stack.pop() - stack.pop());
					break;
				case '*':
					stack.push(stack.pop() * stack.pop());
					break;
				case '/':
					const a = stack.pop();
					const b = stack.pop();
					if (a == 0)
					{
						// ask user input
						alert("/ when a == 0 unimplemented");
					}
					else
					{
						stack.push(Math.floor(b / a));
					}
					break;
				case '%':
					a = stack.pop();
					b = stack.pop();
					if (a == 0)
					{
						// ask user input
						alert("% when a == 0 unimplemented");
					}
					else
					{
						stack.push(Math.floor(b % a));
					}
					break;
				case '!':
					stack.push(stack.pop() == 0 ? 1 : 0);
					break;
				case '`':
					stack.push(stack.pop() < stack.pop() ? 1 : 0);
					break;
				case '?':
					// move randomly
					alert("? unimplemented");
					break;
				case '_':
					dir = (stack.pop() == 0) ? Dir.EAST : Dir.WEST;
					break;
				case '|':
					dir = (stack.pop() == 0) ? Dir.SOUTH : Dir.NORTH;
					break;
				case '\"':
					// assert(stringMode == false)
					stringMode = true;
					break;
				case ':':
					stack.push(stack[stack.length - 1]);
					break;
				case '\\':
					a = stack.pop();
					b = stack.pop();
					stack.push(a);
					stack.push(b);
					break;
				case '$':
					stack.pop();
					break;
				case '.':
					output += stack.pop().toString();
					break;
				case ',':
					output += String.fromCharCode(stack.pop());
					break;
				case '#':
					// skip next cell?
					alert("# unimplemented");
					break;
				case 'p':
					alert("p unimplemented");
					break;
				case 'g':
					alert("g unimplemented");
					break;
				case '&':
					alert("& unimplemented");
					break;
				case '~':
					alert("~ unimplemented");
					break;
				default:
					crash
					alert("died from a " + sourcecode[row][col] + " :(");
					return false;
			}
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