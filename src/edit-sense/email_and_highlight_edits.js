function edit(e){
  
    var ss = SpreadsheetApp.openById(SpreadSheetID);
    var range = e.range;
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty("lastModifiedCellAddress", range.getA1Notation());
    //createTimeEditTrigger();
   
}





function createSpreadsheetEditTrigger() {
    var ss = SpreadsheetApp.openById(SpreadSheetID);
      ScriptApp.newTrigger('edit')
      .forSpreadsheet(ss)
      .onEdit()
      .create();
}
function createTimeEditTrigger() {
    var ss = SpreadsheetApp.openById(SpreadSheetID);
      ScriptApp.newTrigger('senseSend')
      .timeBased()
      .everyMinutes(5)
      .create();
}

function senseSend(){
    var lastModifiedCellAddress = PropertiesService.getScriptProperties().getProperty("lastModifiedCellAddress");
    var ss=SpreadsheetApp.openById(SpreadSheetID);
    ss.getRange(lastModifiedCellAddres).activate();
    var range=ss.getActiveRange();
    Logger.log(range.getA1Notation())      
    range.setBackground('red');
  
    var mailAddress="me15b153@smail.iitm.ac.in";  
    sendEmails(mailAddress);
}

function createOnOpenTrigger(){
    var sheet = SpreadsheetApp.openById(SpreadSheetID);
      ScriptApp.newTrigger("installedOnOpen")
      .forSpreadsheet(sheet)
      .onOpen()
      .create();  
}


function installedOnOpen(){

    var lastModifiedCellAddress = PropertiesService.getScriptProperties().getProperty("lastModifiedCellAddress");
    var ss=SpreadsheetApp.openById(SpreadSheetID);
    ss.getRange(lastModifiedCellAddress).activate();
    var range=ss.getActiveRange();
//  Utilities.sleep(3000);
    range.setBackground('green');
  

}

function sendEmails(mailAddress) {
    var sheet = SpreadsheetApp.openById(SpreadSheetID);
    var emailAddress = mailAddress; // Put recipient mail id here
    var message = "Check link for updates "+"https://docs.google.com/spreadsheets/d/12XEXoyraDpmkLI4babFWmqpbYYDCwo05KAlTHsiLydw/edit?ts=57cd413d#gid=1502904092";       // Add link address instead of Add link here
    var subject = "Sending updates of Facilites Spreadsheet";
    MailApp.sendEmail(emailAddress, subject, message);
   }

function deleteAllEmailTriggers(){
  deleteTriggersWithNames(["senseSend", "edit", "installedOnOpen"]);
}