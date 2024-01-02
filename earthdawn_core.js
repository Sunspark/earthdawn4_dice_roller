var stepDict = {
  // up to step 7
  "basicSteps" : [
    4 // step 1 is D4! then minus 2 (EDPG 4th p33)
    , 4 // step 2 is D4! then minus 1 (EDPG 4th p33)
    , 4
    , 6
    , 8
    , 10
    , 12
  ]
  // steps 8 - 18 repeat up the step chart, with an extra d20 each time.
  , "repeatStepDict" : {
    "8" : [6, 6]
    , "9" : [6, 8]
    , "10" : [8, 8]
    , "11" : [10, 8]
    , "12" : [10, 10]
    , "13" : [12, 10]
    , "14" : [12, 12]
    , "15" : [12, 6, 6]
    , "16" : [12, 8, 6]
    , "17" : [12, 8, 8]
    , "18" : [12, 10, 8]
  }
}


function random(a, b)
{
  return Math.floor(Math.random()*(b-a+1)+a);
}

function recursiveRoll(die, rollArr)
{
  var roll = random(1, die);
  rollArr.push(roll);
  if (roll == die) {
    rollArr = recursiveRoll(die, rollArr);
  }

  return rollArr;
}

function getStepDice(stepNum)
{
  var diceArr = [];
  if (stepNum <= 7) {
    // get from the basic steps
    diceArr.push(stepDict['basicSteps'][stepNum-1]);
  } else {
    var extraD20s = (Math.floor(stepNum / 11) - 1);
    if (extraD20s < 0) { extraD20s = 0; }
    for (var i = 0; i < extraD20s; i++) {diceArr.push(20)};

    var tempStepNum = stepNum - (extraD20s * 11);
    diceArr = diceArr.concat(stepDict['repeatStepDict'][tempStepNum]);
  }
  return diceArr;
}

function doStepDiceRoll(dice)
{
  var stepResultDict = {
    "rolls": new Array()
    , "ones": 0
  };
  for (var i = 0; i < dice.length; i++) {
    var rollArr = recursiveRoll(dice[i], []);
    stepResultDict.rolls = stepResultDict.rolls.concat(rollArr);
    if (rollArr[0] == 1) { stepResultDict.ones++; }
  }
  return stepResultDict;
}

function doStepRoll(stepNum)
{
  // figure out the dice for the step
  dice = getStepDice(stepNum);

  // do the step rolls
  stepResultDict = doStepDiceRoll(dice);

  // if step was 1 or 2, take modifier off.
  if (stepNum == 1) {
    stepResultDict.rolls.push(-2)
  } else if (stepNum == 2) {
    stepResultDict.rolls.push(-1)
  }
  return stepResultDict;
}

function AppendRollResults(results, stepNum)
{
  stepResultDict = doStepRoll(stepNum);
  results.rolls = results.rolls.concat(stepResultDict.rolls);
  results.ones += stepResultDict.ones;
  return results;
}

function roll(coreStepNum, karmaNumber, karmaStepNum, devotionNumber, devotionStepNum)
{
  var results = {
    "rolls": new Array()
    , "rollTotal": 0
    , "ones": 0
    , "result": -1
    , "step": ""
  };
  
  // roll the core step dice
  if (coreStepNum > 0) {
    results = AppendRollResults(results, coreStepNum);
    results.step = results.step.concat(coreStepNum);
  }

  // roll the dice for Karma
  if (karmaNumber > 0 && karmaStepNum > 0) {
    results = AppendRollResults(results, karmaStepNum);
    results.step = results.step.concat(" plus 1 Karma at step " + karmaStepNum);
  }

  // roll the dice for Devotion
  if (devotionNumber > 0 && devotionStepNum > 0) {
    results = AppendRollResults(results, devotionStepNum);
    results.step = results.step.concat(" plus X Devotion at step " + devotionStepNum);
  }

  // total the results
  for (var i = 0; i < results.rolls.length; i++) {
    results.rollTotal += results.rolls[i];
  }
  if (results.rollTotal < 1) {results.rollTotal = 1;}
    
  return results;
}