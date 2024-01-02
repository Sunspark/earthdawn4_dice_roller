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

var resultLevelNames = ["Pathetic", "Poor", "Average", "Good", "Excellent", "Extraordinary"];
var resultLevels = 
[
	[0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0],
	[0, 1, 2, 5, 7, 9],
	[0, 1, 3, 6, 8, 10],
	[0, 1, 4, 7, 10, 12],
	[1, 2, 5, 8, 11, 14],
	[1, 2, 6, 9, 13, 17],
	[1, 3, 7, 11, 15, 19],
	[1, 4, 8, 13, 16, 20],
	[1, 5, 9, 15, 18, 22],
	[1, 6, 10, 16, 20, 23],
	[1, 6, 11, 17, 21, 25],
	[1, 7, 12, 18, 23, 27],
	[1, 7, 13, 20, 25, 29],
	[1, 8, 14, 21, 26, 31],
	[1, 9, 15, 23, 27, 31],
	[1, 10, 16, 24, 28, 33],
	[1, 11, 17, 25, 30, 34],
	[1, 12, 18, 26, 31, 36],
	[1, 12, 19, 28, 33, 37],
	[1, 13, 20, 29, 34, 39],
	[1, 14, 21, 30, 36, 41],
	[1, 15, 22, 31, 37, 42],
	[1, 16, 23, 33, 38, 43],
	[1, 16, 24, 34, 39, 44],
	[1, 17, 25, 35, 41, 46],
	[1, 18, 26, 36, 42, 47],
	[1, 19, 27, 37, 43, 49],
	[1, 19, 28, 39, 45, 50],
	[1, 21, 29, 40, 46, 51],
	[1, 21, 30, 41, 47, 53],
	[1, 22, 31, 42, 48, 54],
	[1, 23, 32, 43, 49, 55],
	[1, 24, 33, 45, 51, 57],
	[1, 24, 34, 46, 52, 58],
	[1, 25, 35, 47, 53, 60],
	[1, 26, 36, 48, 54, 60],
	[1, 27, 37, 49, 56, 62],
	[1, 28, 38, 51, 57, 63],
	[1, 29, 39, 52, 58, 64],
	[1, 30, 40, 53, 59, 66]
];


function random(a, b)
{
	return Math.floor(Math.random()*(b-a+1)+a);
}

function roll(stepNum, karma, difficulty)
{
	if (stepNum < 0)
		stepNum = 0;
	var results = {"rolls": new Array(), "successes": 0, "ones": 0, "result": -1, "difficulty": difficulty, "step": stepNum};
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
	
	setResult(results);
		
	return results;
}

function cloneArray(arr)
{
	var clone = new Array();
	for (var i = 0; i < arr.length; i++)
		clone[i] = arr[i];
	return clone;
}

function setResult(results)
{
	var difficulty = results.difficulty;
	if (!isNaN(difficulty) && difficulty != null)
	{
		if (difficulty < 0)
			difficulty = 0;
		if (results.ones == results.rolls.length)
			results.result = 0;
		else
		{
			var resultLevel = -1;
			var resultThres = [1, Math.floor(difficulty*0.67)-1, difficulty, Math.floor(difficulty*1.29)+3, Math.floor(difficulty*1.395)+6, Math.floor(difficulty*1.47)+9];
			
			//$.create("p", document.body, {"innerHTML": "diff: " + difficulty});
			//$.create("p", document.body, {"innerHTML": resultThres});
			
			for (var i = 0; i < resultThres.length; i++)
			{
				if (resultThres[i] > results.successes)
				{
					resultLevel = i-1;
					break;
				}
			}
			
			/*
			for (var i = 0; i < resultLevels[difficulty].length; i++)
			{
				if (resultLevels[difficulty][i] > results.successes)
				{
					resultLevel = i-1;
					break;
				}
			}
			*/
			
			if (resultLevel > -1)
				results.result = resultLevel;
			else
				results.result = resultThres.length - 1;
		}
	}
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
	if (results.result > -1)
		str += "<br/><b>Result:</b> " + resultLevelNames[results.result] + " [" + (results.result-1) + "] on difficulty " + results.difficulty + " ";
	return str;
}