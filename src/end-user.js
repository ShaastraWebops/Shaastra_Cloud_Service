// End user interface file.

/* To the end user: For activating any of the features of this script, you need to use
 * *only* the functions in this file.
 * 
 * IMPORTANT: Before doing so, however, look at "globals.gs"
 * and modify the appropriate constants where indicated - they are such things as
 * the ID of the spreadsheet you will use, the sheet name inside it, the time slot timings etc.
 * 
 * Please do not modify this file in any way, or for that matter any of the other files in this project,
 * except for the above mentioned globals.gs file.
 *
 * To use the functions in this file, select the function you need to run (the names are self-explanatory)
 * from the toolbar above this code (there will be a "Select function" drop down list).
 * And then run it with the run button (the one to the left of the bug icon).
 *
 * The "Activate..." functions activate features, and the "Deactivate..." functions deactivate them.
 * To (de)activate all features use (De)ActivateAll. You may also activate multiple features by
 * running their respective activation functions one by one, or by using ActivateAll and then deactivating
 * the features you don't need, as you see fit.
 */ 

function ActivateEditMails() {
  /* activates only the edit-sensing mail-sending feature */
  // createOnOpenTrigger();
  createSpreadsheetEditTrigger();
//  createTimeEditTrigger();
}

function DeactivateEditMails() {
  /* deactivates only the edit-sensing mail-sending feature */
  deleteAllEmailTriggers();
}

function ActivateTimeSlotInventory() {
  /* activates only the time-slot based inventory management feature */
  createInventoryTimeBasedTrigger(true);
}

function DeactivateTimeSlotInventory() {
  /* deactivates only the time-slot based inventory management feature */
  deleteAllInventoryTriggers();
}

function ActivateAll() {
  /* activates everything - just calls all the other activation functions in this file */
  ActivateEditMails();
  ActivateTimeSlotInventory();
}
     
function DeactivateAll() {
  /* deactivates everything - just calls all the other deactivation functions in this file */
  DeactivateEditMails();
  DeactivateTimeSlotInventory();
}