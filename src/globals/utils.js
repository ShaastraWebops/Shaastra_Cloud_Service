// utility methods shared across files

function getRange(row1, col1, row2, col2) {
  return sheetToUse.getRange(
    "'" + SHEET_NAME + "'!" + col1 + row1 + ":" + col2 + row2
  );
}

function getHMFromFormattedCell(displayValue) {
  var hh = "", mm = "", c, modifier = "";
  var hDone = false, mDone = false;
  for (var i = 0; i < displayValue.length; ++i) {
    c = "" + displayValue.charAt(i);
    if (!hDone) {
      if (c === ":") hDone = true;
      else hh = hh + c;
    }
    else if (!mDone) {
      if (c === ":") mDone = true;
      else mm = mm + c;
    }
    else if (i === displayValue.length - 2) {
      modifier = (c + displayValue[i + 1]);
      break;
    }
  }
  
  if (hh === "" || mm === "" || (modifier !== "AM" && modifier !== "PM")) {
    hh = -1;
    mm = -1;
  }
  else {
    hh = parseInt(hh);
    mm = parseInt(mm);
    if (modifier === "PM") hh += 12;
  }
  return [hh, mm];
}

function deleteTriggersWithNames(names) {
  var triggers = ScriptApp.getProjectTriggers();
  var fnName = "";
  var i, j;
  for (i = 0; i < triggers.length; i++) 
  {
    fnName = triggers[i].getHandlerFunction();
    for (j = 0; j < names.length; ++j)
      if (fnName === names[j]) {
        ScriptApp.deleteTrigger(triggers[i]);
        break;
      }
  }
}
function stringToArray(string)
{
var array=string.split(',');
return array;
}
