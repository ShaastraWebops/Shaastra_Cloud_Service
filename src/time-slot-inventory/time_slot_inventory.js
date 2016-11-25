function updateSlotTotalsAndGetIDs(useLastFired) {
  var day, slot;
  if (useLastFired) {
    day = scriptProperties.getProperty(PROP_LAST_FIRED_DAY);
    slot = scriptProperties.getProperty(PROP_LAST_FIRED_SLOT);
  }
  else {
    day = scriptProperties.getProperty(PROP_FIRING_DAY);
    slot = scriptProperties.getProperty(PROP_FIRING_SLOT);
  }
  
  if (day == null || slot == null) return null;

  day = parseInt(day);
  slot = parseInt(slot);
  
  var dayStartRow, dayEndRow;
  
  if (day === 0) dayStartRow = 2;
  else dayStartRow = DAY_TOTALS_ROWS[day - 1] + 1;
  dayEndRow = DAY_TOTALS_ROWS[day] - 1;
  
  var requirementsRange = getRange(dayStartRow, SHEET_COLUMNS.requirementsStart,
                                   dayEndRow, SHEET_COLUMNS.requirementsEnd);
  var requirements = requirementsRange.getValues();
  
  var dayTotalsRange = getRange(DAY_TOTALS_ROWS[day], SHEET_COLUMNS.requirementsStart,
                                DAY_TOTALS_ROWS[day], SHEET_COLUMNS.requirementsEnd);
  var dayTotals = dayTotalsRange.getValues();
  
  var startTimes = getRange(dayStartRow, SHEET_COLUMNS.startTime,
                            dayEndRow, SHEET_COLUMNS.startTime
                           ).getDisplayValues();
  
  var allMailIDs = getRange(dayStartRow, SHEET_COLUMNS.coordEmail,
                            dayEndRow, SHEET_COLUMNS.coordEmail
                           ).getValues();
  
  var i, j, k;
  var mailIDs = [];
  var currentID = "";
  var alreadyPresent = false;
  var val = 0;
  
  for (j = 0; j < dayTotalsRange.getNumColumns(); ++j)
    dayTotals[j] = 0;
  
  for (i = 0; i < requirementsRange.getNumRows(); ++i) {
    if (isWithinSlot(getHMFromFormattedCell(startTimes[i][0]), slot)) {
      
      currentID = allMailIDs[i][0];
      alreadyPresent = false;
      for (k = 0; k < mailIDs.length && !alreadyPresent; ++k)
        alreadyPresent = (mailIDs[k] === currentID);
      if (!alreadyPresent)
        mailIDs.push(currentID);
      
      for (j = 0; j < requirementsRange.getNumColumns(); ++j) {
        val = parseInt(requirements[i][j]);
        if (!isNaN(val))
          dayTotals[j] += val;
      }
      
    }
  }
  
  dayTotalsRange.setValues([dayTotals]);
  return mailIDs;
}


function isWithinSlot(hm, slot) {
  if (hm[0] === -1 || hm[0] === NaN) return false;
  
  var checkDate = new Date(0);
  checkDate.setDate(2);
  checkDate.setHours(hm[0]);
  checkDate.setMinutes(hm[1]);
  
  var startDate = new Date(0), endDate = new Date(0);
  startDate.setDate(2);
  startDate.setHours(TIME_SLOTS[slot][0]);
  startDate.setMinutes(TIME_SLOTS[slot][1]);
  endDate.setDate(2);
  endDate.setHours(TIME_SLOTS[slot][2]);
  endDate.setMinutes(TIME_SLOTS[slot][3]);
  
  return (checkDate >= startDate && checkDate <= endDate);
}

function sendMailsToCheckInventory(mailIDs) {
  var subject = "Reminder to check Shaastra MasterSheet";
  var body    = "This is to remind you that you have one or more events coming up " +
                "in the next time slot, so you'll need to check the MasterSheet to " +
                "confirm your total requirements for that slot.\n" + 
                "The spreadsheet is here: " + SPREADSHEET_LINK;
  
  MailApp.sendEmail(mailIDs.join(), subject, body);
}

function updateLastFired() {
  var day, slot;
  day = scriptProperties.getProperty(PROP_FIRING_DAY);
  slot = scriptProperties.getProperty(PROP_FIRING_SLOT);
  if (day == null || slot == null) return ;

  scriptProperties.setProperty(PROP_LAST_FIRED_DAY, parseInt(day));
  scriptProperties.setProperty(PROP_LAST_FIRED_SLOT, parseInt(slot));
}

function updateTotalsAndSendMails() {
  var mailIDs = updateSlotTotalsAndGetIDs(false);
  sendMailsToCheckInventory(mailIDs);

  updateLastFired();
  createInventoryTimeBasedTrigger(false);   // trigger for the next time slot
}

function updateTotalsForEdit (e) {
  updateSlotTotalsAndGetIDs(true);
}

function getNextFiringDate() {
  var currentDate = new Date();
  var firingDate = new Date(DAY_0_DATE);
  
  var day, lastDay, slot, lastSlot;
  for (day = 0, lastDay = -1; day < NUMBER_OF_DAYS; ++day, ++lastDay) {
    for (slot = 0, lastSlot = -1; slot < TIME_SLOTS.length; ++slot, ++lastSlot) {
      firingDate.setHours(TIME_SLOTS[slot][0]);
      firingDate.setMinutes(TIME_SLOTS[slot][1] - TIME_SLOT_OFFSET);
      
      if (currentDate < firingDate) {
        scriptProperties.setProperty(PROP_FIRING_DAY, day);
        scriptProperties.setProperty(PROP_FIRING_SLOT, slot);
        
        if (day > 0 || slot > 0) {
          if (lastSlot == -1) lastSlot = TIME_SLOTS.length - 1;
          else lastDay = day;
          scriptProperties.setProperty(PROP_LAST_FIRED_DAY, lastDay);
          scriptProperties.setProperty(PROP_LAST_FIRED_SLOT, lastSlot);
        }
        return firingDate;
      }
    }
    
    firingDate.setDate(firingDate.getDate() + 1);  // DO NOT USE (DAY_0_DATE.getDate() + day) for this.
  }
  
  return null;
}

function createInventoryTimeBasedTrigger(fromEndUser) {
  var firingDate = getNextFiringDate();
  
  if (firingDate === null) {
    if (fromEndUser)
      throw "You are using the script after the beginning of the "
            + " last time slot of Shaastra 2017, so it will not do anything.";
  }
  else {
    deleteTriggersWithNames(["updateTotalsAndSendMails"]);
    ScriptApp.newTrigger("updateTotalsAndSendMails")
      .timeBased()
      .at(firingDate)
      .create();
  }
}

function createInventoryEditTrigger() {
  ScriptApp.newTrigger("updateTotalsForEdit")
    .forSpreadsheet(sheetToUse.getParent())
    .onEdit()
    .create();
  updateSlotTotalsAndGetIDs(true);  // to initialize the totals rows immediately
}

function deleteAllInventoryTriggers() {
  deleteTriggersWithNames(["updateTotalsAndSendMails", "updateTotalsForEdit"]);
}

function clearPropsForInventory() {
  scriptProperties.deleteProperty(PROP_FIRING_DAY);
  scriptProperties.deleteProperty(PROP_FIRING_SLOT);
}
