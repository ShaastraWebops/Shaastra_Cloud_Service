// utility methods shared across files

function getRange(row1, col1, row2, col2) {
  return sheetToUse.getRange(
    "'" + SHEET_NAME + "'!" + col1 + row1 + ":" + col2 + row2
  );
}

function isInEmailForm(str) {
  return REGEX_EMAIL_VALIDATION.test(str);
}

function getColNumberFromName(colName) {
  var res = 0, codeOffset = 'A'.charCodeAt(0) - 1;
  for (var i = 0; i < colName.length; ++i)
    res = 26 * res + (colName.charCodeAt(i) - codeOffset);
  return res;
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

function appendToCacheArray(key, newValue, expiryTime) {
  var oldValues = cache.get(key);
  if (oldValues == null)
    cache.put(key, newValue, expiryTime);
  else if (oldValues.indexOf(newValue) == -1)
    cache.put(key, oldValues + "," + newValue, expiryTime);
}

function deleteTriggersWithNames(names) {
  var allTriggers = ScriptApp.getProjectTriggers();
  var i;
  for (i = 0; i < allTriggers.length; ++i) 
                        // apparently "for(t in allTriggers)" doesn't work well
    if (names.indexOf(allTriggers[i].getHandlerFunction()) != -1)
                        // apparently "includes()" doesn't work
      ScriptApp.deleteTrigger(allTriggers[i]);
}
