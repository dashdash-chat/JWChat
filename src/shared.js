
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

function msgEscape(msg) {
  msg = msg.replace(/\n/g,"%0A");
  msg = msg.replace(/\r/g,"%0D");
  msg = msg.replace(/ /g,"%20");
  msg = msg.replace(/&/g,"%26");
  msg = msg.replace(/=/g,"%3D");
  msg = msg.replace(/\?/g,"%3F");
  msg = msg.replace(/\:/g,"%3A");
  msg = msg.replace(/>/g,"%3E");
  msg = msg.replace(/</g,"%3C");
  msg = msg.replace(/\)/g,"%29");
  msg = msg.replace(/\(/g,"%28");
  msg = msg.replace(/\"/g,"%22");
  msg = msg.replace(/#/g,"%23");

  return msg;
}

// fucking IE is too stupid for window names
function makeWindowName(wName) {
  wName = wName.replace(/@/,"at");
  wName = wName.replace(/\./g,"dot");
  wName = wName.replace(/\//g,"slash");
  wName = wName.replace(/-/g,"dash");
  return escape(wName);
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
