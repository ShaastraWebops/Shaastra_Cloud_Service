function onEdit(e){
  
 var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = e.range;

  //ss.setNamedRange("RecentlyEdited",range);
 

//Changes only that cell coloruncti to red
  
  range.setBackground('red'); 
  
   

}

function onOpen(){

ScriptApp.newTrigger('clearFormatting').
timeBased()
.everyMinutes(1)
.create();


}

function clearFormatting()
{
var ss = SpreadsheetApp.getActiveSpreadsheet();
  //var range=ss.getRangeByName('RecentlyEdited');
  //range.setBackground('white');
 
}


function createTimeDrivenTriggers() {
  // Trigger every hour.
  ScriptApp.newTrigger('sendEmails')
  //    .forSpreadsheet(id)//Add spreadsheet id here
      .timeBased()
      .everyMinutes(5)
      .create();
}


function sendEmails() {
  var sheet = SpreadsheetApp.getActiveSheet();
 var emailAddress = "" //add email id here
    var message = "Check link for updates "+"";       // Add link address instead of Add link here
    var subject = "Sending updates of Facilites Spreadsheet";
    MailApp.sendEmail(emailAddress, subject, message);
   
}

