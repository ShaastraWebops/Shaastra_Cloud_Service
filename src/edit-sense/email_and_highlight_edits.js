function updateCacheForEdit(e) {
  var editedRange = e.range;

  var editedEmail = sheetToUse.getRange(
                          SHEET_COLUMNS.coordEmail + editedRange.getRow()
                              ).getValue();
  appendToCacheArray(KEY_ALL_MAIL_IDS, editedEmail, EDIT_MAILS_EXPIRY);
  appendToCacheArray(editedEmail, editedRange.getA1Notation(), EDIT_MAILS_EXPIRY);
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