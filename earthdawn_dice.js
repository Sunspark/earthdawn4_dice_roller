function trim(str)
{
	return str.replace(/^\s+|\s+$/g,"");
}

function setup()
{
	$.create("input", $.id("reset"), {"type": "button", "value": "Clear Output"}).addEventListener("click", clearOutput, false);
	$.create("input", $.id("reset"), {"type": "button", "value": "+"}, {"marginLeft": "10px"}).addEventListener("click", makeRoller, false);
	//$.create("input", $.id("reset"), {"type": "button", "value": "Reset"}, {"marginLeft": "10px"}).addEventListener("click", reset, false);
	for (var i = 0; i < 6; i++)
		makeRoller();
}

function makeRoller()
{
	var table = $.create("table", $.id("rollers"), false, {"width": "100%", "marginBottom": "20px"});
	var row1 = $.create("tr", table);
	$.create("td", row1, {"innerHTML": "Step:"}, {"width": "15px"});
	var stepInput = $.create("input", $.create("td", row1, false, {"width": "65px"}), {"type": "text"}, {"width": "100%"});
	$.create("td", row1, {"innerHTML": "Karma:"}, {"width": "45px"});
	var karmaInput = $.create("input", $.create("td", row1, false, {"width": "10px"}), {"type": "checkbox"}, {"width": "10px"});
	var roll = $.create("td", row1, {"innerHTML": "<input type=\"button\" value=\"Roll\"/>"});
	var row2 = $.create("tr", table);
	$.create("td", row2, {"innerHTML": "Label:"});
	var labelInput = $.create("input", $.create("td", row2, {"colSpan": 4}), {"type": "text"}, {"width": "100%"});
	roll.addEventListener("click", makeRoll(stepInput, labelInput, karmaInput), false);
}

function makeRoll(stepInput, labelInput, karmaInput)
{
	var outputArea = $.id("output");
	return function()
	{
		var step = parseInt(trim(stepInput.value));
		if (!isNaN(step))
		{
			var karma = karmaInput.checked;
			var result = roll(step, karma);
			result.label = trim(labelInput.value);
			result.step = step;
			var paragraph = $.create("p", outputArea);
			output(result, paragraph);
			outputArea.scrollTop = outputArea.scrollHeight;
		}
	}
}

function output(result, paragraph)
{
	paragraph.innerHTML = resultsToString(result);
	
}

function reset()
{
	$.id("output").innerHTML = "";
	$.id("rollers").innerHTML = "";
	$.id("reset").innerHTML = "";
	setup();
}

function clearOutput()
{
	$.id("output").innerHTML = "";
}