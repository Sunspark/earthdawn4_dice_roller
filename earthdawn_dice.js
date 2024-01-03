function trim(str)
{
  return str.replace(/^\s+|\s+$/g,"");
}

function setup()
{
  $.create("input", $.id("reset"), {"type": "button", "value": "Clear Output"}).addEventListener("click", clearOutput, false);
  $.create("input", $.id("reset"), {"type": "button", "value": "+"}, {"marginLeft": "10px"}).addEventListener("click", makeRoller, false);
  $.create("input", $.id("reset"), {"type": "button", "value": "Reset"}, {"marginLeft": "10px"}).addEventListener("click", reset, false);
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
  $.create("td", row1, {"innerHTML": "Devotion:"}, {"width": "45px"});
  var devotionInput = $.create("input", $.create("td", row1, false, {"width": "10px"}), {"type": "checkbox"}, {"width": "10px"});
  var roll = $.create("td", row1, {"innerHTML": "<input type=\"button\" value=\"Roll\"/>"});
  var row2 = $.create("tr", table);
  $.create("td", row2, {"innerHTML": "Label:"});
  var labelInput = $.create("input", $.create("td", row2, {"colSpan": 4}), {"type": "text"}, {"width": "100%"});
  roll.addEventListener("click", makeRoll(stepInput, labelInput, karmaInput, devotionInput), false);
}

function makeRoll(stepInput, labelInput, karmaInput, devotionInput)
{
  var outputArea = $.id("output");
  return function()
  {
    var stepNum = parseInt(trim(stepInput.value));
    if (!isNaN(stepNum))
    {

			// figure out Karma
			var karmaNumber = 0;
			var karmaStepNum = 4; // default karma is step 4 (d6)
      var karma = karmaInput.checked;
			if(karma){karmaNumber=1;}

			// figure out Devotion
			var devotionNumber = 0;
			var devotionStepNum = 4; // default devotion is step 4 (d6)
      var devotion = devotionInput.checked;
			if(devotion){devotionNumber=1;}

      var result = roll(stepNum, karmaNumber, karmaStepNum, devotionNumber, devotionStepNum);
      result.label = trim(labelInput.value);
      var paragraph = $.create("p", outputArea);
      output(result, paragraph);
      outputArea.scrollTop = outputArea.scrollHeight;
    }
  }
}

function resultsToString(results)
{
  var str = "";
  if (results.label != "") {
    str += "<b>" + results.label + "</b><br/>";
  }
  str += results.rolls.join(", ") + "<br/><b>Total:</b> " + results.rollTotal;
  str += " on Step ";
  str += results.step;
  if (results.ones == results.rolls.length)
    str += " <b>AUTOMATIC FAILURE</b> ";
  return str;
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