var DEBUGGER_MAX_LEVEL = 4;

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

function DebugMsg(str,lvl,caller) {
	this.str = str || '';
	this.lvl = lvl || 0;
	this.caller = caller || '';
}

function DebugLog(str,lvl) {
  if (!this.debug) // nothing to do
		return;

  this.debugMsgs = this.debugMsgs.concat(new DebugMsg(str,lvl,DebugLog.caller.name));

  if (!this.debugW || !this.debugW.popMsgs)
    return; // debugW not ready yet ... only queue message
  this.debugW.popMsgs();

}

function DebugSetLevel(lvl) {
	if (lvl < 0)
		lvl = 0;
	if (lvl > DEBUGGER_MAX_LEVEL)
		lvl = DEBUGGER_MAX_LEVEL;
	this.lvl = lvl;
}

function DebugStart() {
  if (!this.debugW || this.debugW.closed) { // open the debugger window
    this.debugW = window.open("Debugger.html","debugW"+makeWindowName(this.id),"width=480,height=320,scrollbars=yes,resizable=yes");
		this.debugW.debugger = this;
	}

	this.debug = true;
}

function DebugStop() {
	this.debug = false;
}

function Debugger(lvl,id) {
	this.lvl = lvl || 0;
	if (this.lvl > DEBUGGER_MAX_LEVEL)
		this.lvl = DEBUGGER_MAX_LEVEL;

	this.id = id || '';

	this.debugMsgs = new Array();

	this.debugW = null;

	this.log = DebugLog;
	this.setLevel = DebugSetLevel;
	this.start = DebugStart;
	this.stop = DebugStop;
}
