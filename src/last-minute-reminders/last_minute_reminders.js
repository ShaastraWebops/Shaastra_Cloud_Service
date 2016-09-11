
ScriptApp.newTrigger("triggerFunctionDay0").timeBased().atDate(year, month, day0).create();
ScriptApp.newTrigger("triggerFunctionDay1").timeBased().atDate(year, month, day0+1).create();
ScriptApp.newTrigger("triggerFunctionDay2").timeBased().atDate(year, month, day0+2).create();
ScriptApp.newTrigger("triggerFunctionDay3").timeBased().atDate(year, month, day0+3).create();

var year = 2016, day0 = 5, month = 9, current_row = 0;
var sheet = SpreadsheetApp.getActiveSheet();
var data = sheet.getDataRange().getValues();

function myFunction() {
  sendEmail();
  /*
  var d = new Date();
  var actual_time = d.getHours()+'-'+d.getMinutes();
  var actual_date = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();
  for (var i = 0; i <data.length; i++) 
  {
    var date = data[i][0], time = data[i][1], Email = data[i][2];//Time is delayed by 30 min
    if(actual_date.localeCompare(date) == 0)
    {
      if(actual_time.localeCompare(time) == 0)//Time is delayed by 30 min
      {
        
     }
    }
    //Logger.log('Date:'+ actual_time);
    //Logger.log('Time:'+ time);                              ;
  }
  //Logger.log(d);
  */
}

function sendEmail(){
  var emailAddress = data[current_row][2];
  var message = "Upcomming event"+ data[current_row][0] + data[current_row][1];       
  var subject = "Upcomming Event";
  Logger.log('Message:'+ message);
  MailApp.sendEmail(emailAddress, subject, message);
}

function triggerFunctionDay0(){
  for(var i=0; i<data.length; i++){
    var num = 0, time = data[i][1];
    if(data[i][0].localeCompare("DAY0") == 0){
      if(time[2] == '-'){
        for( var j=0; j<2;j++){
          num = num*10;
          num = num + time[j];
        }
      }
      else if(time[1] == '-'){
        num = time[0];
      }
      current_row = i;
      ScriptApp.newTrigger("sendEmail").timeBased().atHour(num-1).create();
    }
  }
}

function triggerFunctionDay1(){
  for(var i=1; i<data.length; i++){
    var num = 0, time = data[i][1];
    if(data[i][0].localeCompare("DAY1") == 0){
      if(time[2] == '-'){
        for( var j=0; j<2;j++){
          num = num*10;
          num = num + time[j];
        }
      }
      else if(time[1] == '-'){
        num = time[0];
      }
      current_row = i;
      ScriptApp.newTrigger("sendEmail").timeBased().atHour(num-1).create();
    }
  }
}

function triggerFunctionDay2(){
  for(var i=1; i<data.length; i++){
    var num = 0, time = data[i][1];
    if(data[i][0].localeCompare("DAY2") == 0){
      if(time[2] == '-'){
        for( var j=0; j<2;j++){
          num = num*10;
          num = num + time[j];
        }
      }
      else if(time[1] == '-'){
        num = time[0];
      }
      current_row = i;
      ScriptApp.newTrigger("sendEmail").timeBased().atHour(num-1).create();
    }
  }
}

function triggerFunctionDay3(){
  for(var i=1; i<data.length; i++){
    var num = 0, time = data[i][1];
    if(data[i][0].localeCompare("DAY3") == 0){
      if(time[2] == '-'){
        for( var j=0; j<2;j++){
          num = num*10;
          num = num + time[j];
        }
      }
      else if(time[1] == '-'){
        num = time[0];
      }
      current_row = i;
      ScriptApp.newTrigger("sendEmail").timeBased().atHour(num-1).create();
    }
  }
}

