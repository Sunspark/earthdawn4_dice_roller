var stepChart = 
[
	[1],
	[6, -3],
	[6, -2],
	[6, -1],
	[6],
	[8],
	[10],
	[12],
	[6, 6],
	[8, 6],
	[8, 8],
	[10, 8],
	[10, 10],
	[12, 10],
	[12, 12]
];

function random(a, b)
{
	return Math.floor(Math.random()*(b-a+1)+a);
}

function roll(stepNum, karma)
{
	if (stepNum < 0)
		stepNum = 0;
	var results = {"rolls": new Array(), "successes": 0, "ones": 0, "result": -1, "step": stepNum};
	var d12s = Math.max(0, Math.floor((stepNum-8)/7));
	var dice = cloneArray(stepChart[stepNum-7*d12s]);
	for (var i = 0; i < d12s; i++)
		dice.push(12);
	if (karma)
		dice.push(6);
	for (var i = 0; i < dice.length; i++)
	{
		if (dice[i] < 1)
			results.successes += dice[i];
		else
		{
			var roll = random(1, dice[i]);
			results.rolls.push(roll);
			results.successes += roll;
			if (roll == 1)
				results.ones++;
			else if (roll == dice[i])
				i--;
		}
	}
	if (results.successes < 1)
		results.successes = 1;
		
	return results;
}

function cloneArray(arr)
{
	var clone = new Array();
	for (var i = 0; i < arr.length; i++)
		clone[i] = arr[i];
	return clone;
}

function resultsToString(results)
{
	var str = "";
	if (results.label != "")
		str += "<b>" + results.label + "</b><br/>";
	str += results.rolls.join(", ") + "<br/><b>Total:</b> " + results.successes;
	str += " on step " + results.step + " ";
	if (results.ones == results.rolls.length)
		str += " <b>AUTOMATIC FAILURE</b> ";
	return str;
}