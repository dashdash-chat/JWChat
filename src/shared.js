
function getArgs(){
  passedArgs=new Array();
  search = self.location.href;
  search = search.split('?');
  if(search.length>1){
    argList = search[1];
    argList = argList.split('&');
    for(var i=0; i<argList.length; i++){
      newArg = argList[i];
      newArg = argList[i].split('=');
      passedArgs[unescape(newArg[0])] = unescape(newArg[1]);
    }
  }
}

function cutResource(aJID) { // removes resource from a given jid
	if (typeof(aJID) == 'undefined' || !aJID)
		return;
  var retval = aJID;
  if (retval.indexOf("/") != -1)
    retval = retval.substring(0,retval.indexOf("/"));
  return retval;
}

function msgEscape(msg) {
	if (typeof(msg) == 'undefined' || !msg || msg == '')
		return;

  msg = msg.replace(/%/g,"%25"); // must be done first

  msg = msg.replace(/\n/g,"%0A");
  msg = msg.replace(/\r/g,"%0D");
  msg = msg.replace(/ /g,"%20");
  msg = msg.replace(/\"/g,"%22");
  msg = msg.replace(/#/g,"%23");
  msg = msg.replace(/\$/g,"%24");
  msg = msg.replace(/&/g,"%26");
  msg = msg.replace(/\(/g,"%28");
  msg = msg.replace(/\)/g,"%29");
  msg = msg.replace(/\+/g,"%2B");
  msg = msg.replace(/,/g,"%2C");
  msg = msg.replace(/\//g,"%2F");
  msg = msg.replace(/\:/g,"%3A");
  msg = msg.replace(/\;/g,"%3B");
  msg = msg.replace(/</g,"%3C");
  msg = msg.replace(/=/g,"%3D");
	msg = msg.replace(/>/g,"%3E");
	msg = msg.replace(/@/g,"%40");

  return msg;
}

// fucking IE is too stupid for window names
function makeWindowName(wName) {
  wName = wName.replace(/@/,"at");
  wName = wName.replace(/\./g,"dot");
  wName = wName.replace(/\//g,"slash");
  wName = wName.replace(/&/g,"amp");
  wName = wName.replace(/\'/g,"tick");
  wName = wName.replace(/=/g,"equals");
  wName = wName.replace(/#/g,"pound");
  wName = wName.replace(/:/g,"colon");	
  wName = wName.replace(/%/g,"percent");
  wName = wName.replace(/-/g,"dash");
  wName = wName.replace(/ /g,"blank");
  return wName;
}

function htmlEnc(str) {
  str = str.replace(/&/g,"&amp;");
  str = str.replace(/</g,"&lt;");
  str = str.replace(/>/g,"&gt;");
  return str;
}

function msgFormat(msg) { // replaces emoticons and urls in a message

  msg = htmlEnc(msg);

  for (var i in emoticons) {
    var iq = i.replace(/\\/g, '');
    msg = msg.replace(eval("/\(\\s\|\^\)"+i+"\\B/g"),"$1<img src=\""+emoticonpath+emoticons[i]+"\" alt=\""+iq+"\">");
  }
	
  // replace http://<url>
  msg = msg.replace(/(\s|^)(https{0,1}:\/\/\S+)/gi,"$1<a href=\"$2\" target=\"_blank\">$2</a>");
  
  // replace mail-links
  msg = msg.replace(/(\s|^)(\w+\@\S+\.\S+)/g,"$1<a href=\"mailto:$2\">$2</a>");
  
  // replace *<pattern>*
  msg = msg.replace(/(\s|^)\*([^\*]+)\*/g,"$1<i><b>$2</b></i>");

  // replace _bla_ 
  msg = msg.replace(/(\s|^)\_([^\*]+)\_/g,"$1<u>$2</u>");

  msg = msg.replace(/\n/g,"<br>");

  return msg;
}

/* isValidJID
 * checks whether jid is valid
 */
var prohibited = ['"',' ','&','\'','/',':','<','>','@']; // invalid chars
function isValidJID(jid) {
  var nodeprep = jid.substring(0,jid.lastIndexOf('@')); // node name (string before the @)

  for (var i in prohibited) {
    if (nodeprep.indexOf(prohibited[i]) != -1) {
      alert(loc("Invalid JID\n'[_1]' not allowed in JID.\nChoose another one!",prohibited[i]));
      return false;
    }
  }
  return true;
}

/* hrTime - human readable Time
 * takes a timestamp in the form of 20040813T12:07:04 as argument
 * and converts it to some sort of humane readable format
 */
function hrTime(ts) {
	var date = new Date(Date.UTC(ts.substring(0,4),ts.substring(4,6)-1,ts.substring(6,8),ts.substring(9,11),ts.substring(12,14),ts.substring(15,17)));
	return date.toLocaleString();
}
