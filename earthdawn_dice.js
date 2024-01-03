function trim(str)
{
  return str.replace(/^\s+|\s+$/g,"");
}


// Modes are:
// Basic ('b') - tickbox interface, karma and devotion locked at 1 point d6.
// Advanced ('a') - textbox interface, karma and devotion multiple points at d?
// Complex ('c') - textbox interface, karma and devotion can have multiple points at different d values, cursed luck.

function setup(mode='Basic')
{
  $.create("input", $.id("reset"), {"type": "button", "value": "Clear Output"}).addEventListener("click", clearOutput, false);
  var addRollerButton = $.create("input", $.id("reset"), {"type": "button", "value": "+"}, {"marginLeft": "10px"});
  $.create("input", $.id("reset"), {"type": "button", "value": "Basic"}, {"marginLeft": "10px"}).addEventListener("click", reset, false);
  $.create("input", $.id("reset"), {"type": "button", "value": "Advanced"}, {"marginLeft": "10px"}).addEventListener("click", reset, false);

  if (mode == 'Basic') {
    for (var i = 0; i < 6; i++) {
      makeBasicRoller();
    }
    addRollerButton.addEventListener("click", makeBasicRoller, false);
  } else if (mode == 'Advanced') {
    makeAdvancedRoller();
    addRollerButton.addEventListener("click", makeAdvancedRoller, false);
  } else if (mode == 'Complex') {
  }
}

function makeBasicRoller()
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
  var labelInput = $.create("input", $.create("td", row2, {"colSpan": 6}), {"type": "text"}, {"width": "100%"});
  roll.addEventListener("click", makeBasicRoll(stepInput, labelInput, karmaInput, devotionInput), false);
}

function makeAdvancedRoller()
{
  var table = $.create("table", $.id("rollers"), false, {"width": "100%", "marginBottom": "20px"});
  var row1 = $.create("tr", table);
  $.create("td", row1, {"innerHTML": "Step:"}, {"width": "15px"});
  var stepInput = $.create("input", $.create("td", row1, {"colSpan": 2}), {"type": "text"}, {"width": "100%"});

  var roll = $.create("td", row1, {"innerHTML": "<input type=\"button\" value=\"Roll\"/>"});

	var row2 = $.create("tr", table);
  $.create("td", row2, {"innerHTML": "Karma:"}, {"width": "45px"});
  var karmaNumberInput = $.create("input", $.create("td", row2, false, {"width": "65px"}), {"type": "text"}, {"width": "100%"});
  $.create("td", row2, {"innerHTML": "@ Step:"}, {"width": "45px"});
  var karmaStepNumInput = $.create("input", $.create("td", row2, false, {"width": "65px"}), {"type": "text", "value":"4"}, {"width": "100%"});

	var row3 = $.create("tr", table);
  $.create("td", row3, {"innerHTML": "Devotion:"}, {"width": "45px"});
  var devotionNumberInput = $.create("input", $.create("td", row3, false, {"width": "65px"}), {"type": "text"}, {"width": "100%"});
  $.create("td", row3, {"innerHTML": "@ Step:"}, {"width": "45px"});
  var devotionStepNumInput = $.create("input", $.create("td", row3, false, {"width": "65px"}), {"type": "text", "value":"4"}, {"width": "100%"});

	var row4 = $.create("tr", table);
  $.create("td", row4, {"innerHTML": "Label:"});
  var labelInput = $.create("input", $.create("td", row4, {"colSpan": 3}), {"type": "text"}, {"width": "100%"});
  roll.addEventListener("click", makeAdvancedRoll(stepInput, labelInput, karmaNumberInput, karmaStepNumInput, devotionNumberInput, devotionStepNumInput), false);
}

function makeBasicRoll(stepInput, labelInput, karmaInput, devotionInput)
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

function makeAdvancedRoll(stepInput, labelInput, karmaNumberInput, karmaStepNumInput, devotionNumberInput, devotionStepNumInput)
{
  var outputArea = $.id("output");
  return function()
  {
    var stepNum = parseInt(trim(stepInput.value));
    var karmaNumber = parseInt(trim(karmaNumberInput.value));
    var karmaStepNum = parseInt(trim(karmaStepNumInput.value));
    var devotionNumber = parseInt(trim(devotionNumberInput.value));
    var devotionStepNum = parseInt(trim(devotionStepNumInput.value));

    if (isNaN(karmaNumber)) { karmaNumber = 0; }
    if (isNaN(karmaStepNum)) { karmaStepNum = 4; } // default them to d6
    if (isNaN(devotionNumber)) { devotionNumber = 0; }
    if (isNaN(devotionStepNum)) { devotionStepNum = 4; } // default them to d6

    if (!isNaN(stepNum))
    {
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
  var mode = this.value;
  
  $.id("output").innerHTML = "";
  $.id("rollers").innerHTML = "";
  $.id("reset").innerHTML = "";
  setup(mode);
}

function clearOutput()
{
  $.id("output").innerHTML = "";
}