var sheet = SpreadsheetApp.getActiveSheet();
var data = sheet.getDataRange().getValues();

//adjust values accordingly.........
var day = 25;var month = 09;var year = 2017;
var slotA_start = "08:00", slotA_end = "12:00";
var slotB_start = "13:00", slotB_end = "18:00";

//fixed according sheets............
var eventName = 0, cordEmail = 1, fromTime = 3, toTime = 4;

var flag =0, total_row = 0;

ScriptApp.newTrigger("compareFunction",[0]).timeBased().atDate(year, month, day).create();
ScriptApp.newTrigger("compareFunction",[1]).timeBased().atDate(year, month, day+1).create();
ScriptApp.newTrigger("compareFunction",[2]).timeBased().atDate(year, month, day+2).create();
ScriptApp.newTrigger("compareFunction",[3]).timeBased().atDate(year, month, day+3).create();

//var day = 0;

function compareFunction(day){
  var slotA = [],slotB = [];
  //var d = data[2][fromTime];
  //Logger.log((data[1][eventName].toString())=== "DAY "+ day);
  
  for(var i=0; i<data.length; i++){
    if(data[i][eventName].toString() === "DAY "+ day)
      flag = 1;
    else if(data[i][eventName].toString() === "DAY "+ (day+1)){
      total_row = i-1;
      flag = 0;
      break;
    }
    else 
      flag = 0;
    
    if(falg == 1){
      if( data[i][cordEmail] != null){
        if( Time(data[i][fromTime].toString()) >= Time(slotA_start) &&  Time(data[i][fromTime].toString()) <= Time(slotA_end)){
           slotA.push(data[i]);  
        }
        else
          slotB.push(data[i]);
      }
    }
  }
  ScriptApp.newTrigger("sendEmail",[slotA]).timeBased().atHour(trigEmail(slotA_start)).create();
  ScriptApp.newTrigger("sendEmail",[slotB]).timeBased().atHour(trigEmail(slotB_start)).create();
  //sendEmail(slotA, 1);
  //sendEmail(slotB, 2);
}

function trigEmail(num){
  var time = parseInt(num[0])*10 + parseInt(num[1])*1;
  return time;
}

function Time(str){
  var time = parseInt(str[0])*1000 + parseInt(str[1])*100 + parseInt(str[3])*10 + parseInt(str[4])*1 ;
  return time;
}

function sendEmail(slt){
  total(slt);
  for(var j=0;j < slt.length;j++){
    for(var i=0; i< j ;i++){
      if(slt[j][cordEmail].toString() === slt[i][cordEmail].toString()){
        slt.splice(i, 1);
      }
    }
  }
  
  for(var i=0;i < slt.length;i++){
     email( slt[i][cordEmail].tostring() );  
  }
}

function total(slot){
  var total = [];
  for(var i = 5; i< slot[0].length; i++)//initialization may change........................
  {
    var sum = 0;
    for(var j = 0; j<slot.length; j++){
      sum = sum + parseInt(slot[j][i]);
    }
    total.push(sum);
    Logger.log(sum);
    data[total_row][i] = sum;
  }
}

function email(emailid){
  var emailAddress = emailid;
  var message = "Upcomming event check spreadSheet.";       
  var subject = "Upcomming Event Reminder";
  Logger.log('Message:'+ message);
  MailApp.sendEmail(emailAddress, subject, message);
}
