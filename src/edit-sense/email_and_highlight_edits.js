function updateCacheForEdit(e) {
  Logger.log("Edit trigger activated");
  var editedRange = e.range;
  var firstCol = editedRange.getColumn(), firstRow = editedRange.getRow(),
      lastCol = editedRange.getLastColumn(), lastRow = editedRange.getLastRow();
  
  if (firstCol > getColNumberFromName(SHEET_COLUMNS.requirementsEnd))
    Logger.log("Range past end");
  else if (lastCol < getColNumberFromName(SHEET_COLUMNS.requirementsStart))
    Logger.log("Range before start");
  else {
    Logger.log("Good range");
    var editedEmail = "";
    for (var row = firstRow; row <= lastRow; ++row) {
      editedEmail = sheetToUse.getRange(
        SHEET_COLUMNS.coordEmail + row
      ).getDisplayValue();
      Logger.log("Email col value: " + editedEmail);
      if (isInEmailForm(editedEmail)) {
        Logger.log("In email form");
        appendToCacheArray(KEY_ALL_MAIL_IDS, editedEmail, EDIT_MAILS_EXPIRY);
        appendToCacheArray(editedEmail,
                           getRange(row, firstCol, row, lastCol).getA1Notation(),
                           EDIT_MAILS_EXPIRY);
      }
    }
  }
}

function createSpreadsheetEditTrigger() {
  ScriptApp.newTrigger('updateCacheForEdit')
    .forSpreadsheet(sheetToUse.getParent())
    .onEdit()
    .create();
}

function createTimeEditTrigger() {
  ScriptApp.newTrigger('sendMailsFromCache')
    .timeBased()
    .everyMinutes(EDIT_MAILS_INTERVAL)
    .create();
}

function sendMailsFromCache() {
  // sheetToUse.getRange(values[mailAddress]).setBackground("red");
  Logger.log("Timed trigger activated");
  var allMailIDs = cache.get(KEY_ALL_MAIL_IDS);    
  if (allMailIDs != null) {
    sendMailsToSeeEdits(allMailIDs.split(','));
    clearCacheForEditMails();
  }
}

function createOnOpenTrigger() {
  ScriptApp.newTrigger("installedOnOpen")
    .forSpreadsheet(sheetToUse.getParent())
    .onOpen()
    .create();
}

function installedOnOpen() {
  var mail_ID = cache.get(KEY_ALL_MAIL_IDS);
  var values = cache.getAll(mail_ID);

  for(mailAddress in values)
    sheetToUse.getRange(values[mailAddress]).activate();

  Utilities.sleep(5000);
  sheetToUse.getActiveRange().setBackground("white");
}

function sendMailsToSeeEdits(mailIDs) {
  var message = "Check link for updates " + SPREADSHEET_LINK; 
  var subject = "Sending updates (new edits) of Facilites Spreadsheet";
  MailApp.sendEmail(mailIDs.join(), subject, message);
}

function deleteAllEmailTriggers() {
  deleteTriggersWithNames(["sendMailsFromCache", "updateCacheForEdit", "installedOnOpen"]);
}

function clearCacheForEditMails() {
  var allKeys = cache.get(KEY_ALL_MAIL_IDS);
  if (allKeys != null) {
    var arrayAllKeys = allKeys.split(',');
    arrayAllKeys.push(KEY_ALL_MAIL_IDS);
    cache.removeAll(arrayAllKeys);
  }
}