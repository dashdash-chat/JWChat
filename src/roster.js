/* images */
var availableLed = new Image();
availableLed.src = "images/available.gif";
var chatLed = new Image();
chatLed.src = "images/chat.gif";
var awayLed = new Image();
awayLed.src = "images/away.gif";
var xaLed = new Image();
xaLed.src = "images/xa.gif";
var dndLed = new Image();
dndLed.src = "images/dnd.gif";
var invisibleLed = new Image();
invisibleLed.src = "images/invisible.gif";
var unavailableLed = new Image();
unavailableLed.src = "images/unavailable.gif";
var stalkerLed = new Image();  
stalkerLed.src = "images/stalker.gif";
var messageImg = new Image();
messageImg.src = "images/message.gif";
var grp_open_img = new Image();
grp_open_img.src = 'images/group_open.gif';
var grp_close_img = new Image();
grp_close_img.src = 'images/group_close.gif';

function RosterGroup(name) {
  this.name = name;
  this.users = new Array();
  this.onlUserCount = 0;
  this.messagesPending = 0;
}

function RosterUserAdd2Group(group) {
  this.groups = this.groups.concat(group);
}

function RosterUser(jid,subscription,groups,name) {
  this.jid = jid || 'unknown';

  this.subscription = subscription || 'none';
  this.groups = groups || [''];

  if (name)
    this.name = name;
  else if (this.jid == JABBERSERVER)
    this.name = loc("System");
  else if ((this.jid.indexOf('@') != -1) && this.jid.substring(this.jid.indexOf('@')+1) == JABBERSERVER) // we found a local user
    this.name = this.jid.substring(0,jid.indexOf('@'));
  else
    this.name = this.jid;

  this.name = htmlEnc(this.name);

  // initialise defaults
  this.status = (this.subscription == 'from' || this.subscription == 'none') ? 'stalker' : 'unavailable';
  this.statusMsg = null;
  this.lastsrc = null;
  this.messages = new Array();
  this.chatmsgs = new Array();
  this.chatW = null; // chat window

  // methods
  this.add2Group = RosterUserAdd2Group;

}

function getElFromArrByProp(arr,prop,str) {
  for (var i in arr) {
    if (arr[i][prop] == str)
      return arr[i];
  }
  return null;
}

function getRosterGroupByName(groupName) {
  return getElFromArrByProp(this.groups,"name",groupName);
}

function getRosterUserByJID(jid) {
  return getElFromArrByProp(this.users,"jid",jid);
}

function RosterUpdateStyleIE() {
  if(!is.ie)
    return;
  this.rosterW.getElementById("roster").style.width = this.rosterW.body.clientWidth;
}

function RosterGetUserIcons(from) {
  var images = new Array();
  
  for (var i=0; i<this.groups.length; i++) {
    var img = this.rosterW.images[from+"/"+this.groups[i].name];
    if (img) {
      images = images.concat(img);
      continue; // skip this group
    }
  }
  return images;
}


function RosterToggleHide() {
  this.usersHidden = !this.usersHidden;
  this.print();
  return;
}
	
function RosterToggleGrp(name) {
  var el = this.rosterW.getElementById(name);
  if (el.className == 'hidden') {
    el.className = 'rosterGroup';
    this.getGroupByName(name).toggled = false;
    this.rosterW.images[name+"Img"].src = grp_open_img.src;
  } else {
    el.className = 'hidden';
    this.getGroupByName(name).toggled = true;
    this.rosterW.images[name+"Img"].src = grp_close_img.src;
  }
  this.updateStyleIE();
}

function RosterOpenMessage(jid) {
  var user = this.getUserByJID(jid);
  var wName = makeWindowName(user.jid); 

  if (user.chatmsgs.length > 0) {
    this.openChat(jid);
    return false;
  }

  if (user.messages.length > 0 && (!user.mW || user.mW.closed)) // display messages
    user.mW = open('message.html?jid='+escape(jid),"mw"+wName,'width=320,height=230,dependent=yes,resizable=yes');
  else if (!user.sW || user.sW.closed) // open send dialog
    user.sW = open("send.html?jid="+escape(jid),"sw"+wName,'width=320,height=200,dependent=yes,resizable=yes');
  return false;
}

function RosterOpenChat(jid) {
  var user = this.getUserByJID(jid);
  
  if (!user.chatW || user.chatW.closed)
    user.chatW = open("chat.html?jid="+escape(jid),"chatW"+makeWindowName(user.jid),"width=320,height=360,resizable=yes");
  else if (user.chatW.popMsgs)
    user.chatW.popMsgs();
}

function RosterClose() {
  for (var i in this.users) {
    if (this.users[i].roster)
      this.users[i].roster.close();
    if (this.users[i].sW)
      this.users[i].sW.close();
    if (this.users[i].mW)
      this.users[i].mW.close();
    if (this.users[i].chatW)
      this.users[i].chatW.close();
  }
}

function RosterUpdateGroupForUser(user) {
  for (var j in user.groups) {
    if (user.groups.length > 1 && user.groups[j] == '')
      continue;
    var groupName = (user.groups[j] == '') ? loc('Unfiled') : user.groups[j];
    var group = this.getGroupByName(groupName);
    if(group == null) {
      group = new RosterGroup(groupName);
      this.groups = this.groups.concat(group);
    }
    group.users = group.users.concat(user);
  }
}
	
function RosterUpdateGroups() {
  this.groups = new Array();
  for (var i in this.users)
    this.updateGroupsForUser(this.users[i]);
}

function RosterUserAdd(user) {
  this.users = this.users.concat(user);
	
  // add to groups
  this.updateGroupsForUser(user);
  return user;
}
	
function RosterRemoveUser(user) {
  this.groups = new Array();
  for (var i in this.users) {
    if (user == this.users[i]) {
      this.users = this.users.slice(0,i).concat(this.users.slice(i+1,this.users.length));
      break;
    }
  }
  this.updateGroups();
}
	
function Roster(items,targetW) {
  this.users = new Array();
  this.groups = new Array();
  this.name = 'Roster';

  this.rosterW = targetW;
	
  /* object's methods */
  this.print = printRoster;
  this.getGroupByName = getRosterGroupByName;
  this.getUserByJID = getRosterUserByJID;
  this.addUser = RosterUserAdd;
  this.removeUser = RosterRemoveUser;
  this.updateGroupsForUser = RosterUpdateGroupForUser;
  this.updateGroups = RosterUpdateGroups;
  this.toggleGrp = RosterToggleGrp;
  this.updateStyleIE = RosterUpdateStyleIE;
  this.toggleHide = RosterToggleHide;
  this.getUserIcons = RosterGetUserIcons;
  this.openMessage = RosterOpenMessage;
  this.openChat = RosterOpenChat;
  this.close = RosterClose;
 
  /* setup groups */
  for (var i in items) {
    /* if (items[i].jid.indexOf("@") == -1) */ // no user - must be a transport
    if (typeof(items[i].jid) == 'undefined')
      continue;
    items[i].jid = cutResource(items[i].jid);
    items[i].name = (items[i].name) ? items[i].name : items[i].jid;
    this.addUser(new RosterUser(items[i].jid,items[i].subscription,items[i].groups,items[i].name));
  }
}

function rosterSort(a,b) {
  return (a.name.toLowerCase()<b.name.toLowerCase())?-1:1;
}

function printRoster() {
	
  /* update user count for groups */
  for (var i=0; i<this.groups.length; i++) {
    this.groups[i].onlUserCount = 0;
    this.groups[i].messagesPending = 0;
    for (var j=0; j<this.groups[i].users.length; j++) {
      if (this.groups[i].users[j].status != 'unavailable' && this.groups[i].users[j].status != 'stalker')
        this.groups[i].onlUserCount++;
      if (this.groups[i].users[j].lastsrc)
        this.groups[i].messagesPending++;
    }
  }
	
  var rosterHTML = '';
  
  this.groups = this.groups.sort(rosterSort);
  
  for (var i=0; i<this.groups.length; i++) {
    var rosterGroupHeadClass = (this.usersHidden && this.groups[i].onlUserCount == 0 && this.groups[i].messagesPending == 0) ? 'rosterGroupHeaderHidden':'rosterGroupHeader';
    rosterHTML += "<div id='"+this.groups[i].name+"Head' class='"+rosterGroupHeadClass+"' onDblClick='toggleGrp(\""+this.groups[i].name+"\");'><nobr>";
    var toggleImg = (this.groups[i].toggled)?'images/group_close.gif':'images/group_open.gif';
    rosterHTML += "<img src='"+toggleImg+"' name='"+this.groups[i].name+"Img' align='middle' onClick='toggleGrp(\""+this.groups[i].name+"\");'> ";
    rosterHTML += this.groups[i].name+ " (<span id='"+this.groups[i].name+"On'>"+this.groups[i].onlUserCount+"</span>/" + this.groups[i].users.length + ")";
    rosterHTML += "</nobr></div>";
    var rosterGroupClass = ((this.usersHidden && this.groups[i].onlUserCount == 0 && this.groups[i].messagesPending == 0) || this.groups[i].toggled)?'hidden':'rosterGroup';
    rosterHTML += "<div id='"+this.groups[i].name+"' class='"+rosterGroupClass+"'>";
    
    this.groups[i].users = this.groups[i].users.sort(rosterSort);
    for (var j=0; j<this.groups[i].users.length; j++) {
      var user = this.groups[i].users[j];
      var rosterUserClass = (this.usersHidden && (user.status == 'unavailable' || user.status == 'stalker') && !user.lastsrc) ? "hidden":"rosterUser";
      rosterHTML += "<div id='"+user.jid+"/"+this.groups[i].name+"Entry' class='"+rosterUserClass+"' onClick=\"return userClicked(this,'"+user.jid+"');\"";
      if (user.statusMsg)
        rosterHTML += " title=\"" + user.statusMsg + "\"";
      rosterHTML += "><nobr>";
      
      var userImg = (user.lastsrc) ? messageImg : eval(user.status + "Led");
      rosterHTML += "<img src='"+userImg.src+"' name='"+user.jid+"/"+this.groups[i].name+"' align='left' style=\"padding-bottom: 4px;\">";
      rosterHTML += "<div><span class=\"nickName\">"+user.name+"</span>";
      if (user.statusMsg)
        rosterHTML += "<br><nobr><span class=\"statusMsg\">"+user.statusMsg+"</span></nobr>";
      rosterHTML += "</div></nobr></div>";
    }
    rosterHTML += "</div>";
  }

  this.rosterW.getElementById("roster").innerHTML = rosterHTML;
  this.updateStyleIE();

  if (typeof(this.eprint) != 'undefined')
    this.eprint();
}


/***********************************************************************
 * GROUPCHAT ROSTER
 *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

function GroupchatRosterUserAdd2Group(group) {
  this.groups = [group];
}

function GroupchatRosterUser(jid,name) {
  this.base = RosterUser;
  this.base(jid,'',[''],name);

  this.affiliation = 'none';
  this.role = 'none';

  this.add2Group = GroupchatRosterUserAdd2Group;
}

GroupchatRosterUser.prototype = new RosterUser;

function GroupchatRosterPrint() {
  this.targetW.document.getElementById('chan_count').innerHTML = this.users.length;
}

function GroupchatRoster(targetW) {

  this.base = Roster;
  this.base(null);
  this.usersHidden = true;

  this.targetW = targetW.frames.groupchatRoster;

  this.rosterW = this.targetW.groupchatIRoster.document;

  this.name = 'GroupchatRoster';

  //  this.eprint = GroupchatRosterPrint;
}

GroupchatRoster.prototype = new Roster();


