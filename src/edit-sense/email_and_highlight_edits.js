var key="mail-id key";

function edit(e){
  
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var range = e.range;
    var range_name=range.getA1Notation();
    
    var cell=sheetToUse.getRange('B'+range.getRow());
    var edited_email=cell.getValue();
    
    var global_key=cache.get(key);    
  if(global_key)  
  {
  var mail_ID=stringToArray(global_key);
  var check_mail=!global_key.includes(edited_email);

  } 
   
  if(cache.get(edited_email))
  { 
    var final_range=stringToArray(cache.get(edited_email));
  }
  
  if(check_mail)
   { 
     mail_ID.push(edited_email);
   }
  
  if(final_range.includes(range_name)<0)
  {
    final_range.push(range_name);
  }
    cache.put(edited_email,final_range,EDIT_MAILS_EXPIRY)
    
    cache.put(key,mail_ID, EDIT_MAILS_EXPIRY);
    
}


function createSpreadsheetEditTrigger() {
  ScriptApp.newTrigger('edit')
    .forSpreadsheet(sheetToUse.getParent())
    .onEdit()
    .create();
}

function createTimeEditTrigger() {
  ScriptApp.newTrigger('senseSend')
    .timeBased()
    .everyMinutes(EDIT_MAILS_INTERVAL)
    .create();
}

function senseSend(){
     var global_key=cache.get(key);    
  if(global_key)  
  {
  var mail_ID=stringToArray(global_key);
  

    var values = cache.getAll(mail_ID);
    for(mailAddress in values)
      {
         sheetToUse.getRange(values[mailAddress]).setBackground("red");
         sendEmails(mailAddress);
      }
  }
    

}

function createOnOpenTrigger(){
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      ScriptApp.newTrigger("installedOnOpen")
      .forSpreadsheet(sheet)
      .onOpen()
      .create();  
}


function installedOnOpen(){
    var mail_ID=cache.get(key);
    var values = cache.getAll(mail_ID);
    for(mailAddress in values)
      {
         sheetToUse.getRange(values[mailAddress]).activate();
      
      }

    Utilities.sleep(5000);
    sheetToUse.getActiveRange().setBackground("white")
  

}

function sendEmails(mailAddress) {
    
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var emailAddress = mailAddress; // Put recipient mail id here
    var message = "Check link for updates "+SPREADSHEET_LINK; 
    var subject = "Sending updates of Facilites Spreadsheet";
    MailApp.sendEmail(emailAddress, subject, message);
   }

function deleteAllEmailTriggers(){
  deleteTriggersWithNames(["senseSend", "edit", "installedOnOpen"]);
}
