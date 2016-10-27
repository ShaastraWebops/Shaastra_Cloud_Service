// global constants and variables

/*
 * To the end-user: Please modify only those constants that are indicated to be "editable by the end user".
 * Do these modifications before running any of the functions inside end-user.gs.
 */

// constants, editable by the end-user

var SPREADSHEET_ID = "12XEXoyraDpmkLI4babFWmqpbYYDCwo05KAlTHsiLydw";
    // the ID of the full spreadsheet. You can get it by opening the spreadsheet and
    // pasting the characters that come after "https://docs.google.com/spreadsheets/d/"
    // and before the next "/".

var SHEET_NAME = "Event wise";     // the name of the sheet inside the spreadsheet that is to be used
                                   // (EXACTLY as specified in the actual spreadsheet, with matching case, punctuation etc)

var NUMBER_OF_DAYS = 3;            // total number of days in Shaastra (including Day 0)
var DAY_0_STRING = "2016/10/10";   // YYYY/MM/DD formatted date of Day 0

var EDIT_MAILS_INTERVAL = 5;      // edit-sensing mails: time period (minutes) with which mails will be sent

var TIME_SLOTS = [
  [8, 00, 9, 00],
  [10, 00, 10, 30],
  [10, 46, 23, 00]
];
    // The time slots to use for inventory management, in 24hr format.
    // Please maintain in sorted order, i.e. don't put "9-10am" after "1-2pm" etc.
    // Each slot is entered in the form [hh, mm, hh, mm], where
    // the first pair is the start time and the second pair is the end time.
    // After each slot there must be a comma, except for the last slot.

var TIME_SLOT_OFFSET = 0;         // The no. of minutes before which reminder mails are to be sent for every slot,
                                  // i.e. if this is 30, then for a slot that starts at 8am,
                                  // the reminder will be sent by 7:30 am.

var DAY_TOTALS_ROWS = [12, 34, 63, 94, 115]; // the row numbers in which each day's totals are stored

var SHEET_COLUMNS = {
  coordEmail: "B",              // the column having all the coords' emails.
  
  startTime: "D",               // the column having the starting time (formatted in the Time format with AM-PM as well)
                                // for each event, i.e. row.
  
  requirementsStart: "F",       // the column that marks the start of the range that holds individual requirements' values.
                                // (inclusive)
  
  requirementsEnd: "U"          // the column that marks the end of the range that holds individual requirements' values. 
                                // (inclusive)  
};
    // The column letters corresponding to specific columns in the sheet which will be used by this script.
    // This is CRITICAL for the functioning of the script, so please make sure the requisite column letters
    // are inserted here, as mentioned in the comments, before activating any feature.

/* To the end-user: you can stop here */







// constants, NOT editable by the end user
var SPREADSHEET_LINK = "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/";
var DAY_0_DATE = new Date(DAY_0_STRING);

var EDIT_MAILS_EXPIRY = 60 * (1 + EDIT_MAILS_INTERVAL);   // in seconds, 1min buffer time added
var KEY_ALL_MAIL_IDS = "editsense-allIDs";

var PROP_FIRING_DAY = "timeslot-firingDay";
var PROP_FIRING_SLOT = "timeslot-firingSlot";

// variables, re-initialized on every function call, NOT editable by the end user
var sheetToUse = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
SPREADSHEET_LINK += "edit#gid=" + sheetToUse.getSheetId();

var scriptProperties = PropertiesService.getScriptProperties();
var cache = CacheService.getScriptCache();
