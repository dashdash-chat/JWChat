/*
 * JWChat, a web based jabber client
 * Copyright (C) 2003-2004 Stefan Strigler <steve@zeank.in-berlin.de>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *
 * Please visit http://jwchat.sourceforge.net for more information!
 */

/*
 * This is the main configuration file for the chat client itself.
 * You have to edit this before you can use jwchat on your website!
 *
 * Have a look at the README for hints and troubleshooting!
 */

var SITENAME = "zeank.darktech.org"
var DEFAULTRESOURCE = "jwchat";

/* BACKENDS
 * Array of objects each describing a backend.
 *
 * Required object fields:
 * name      - human readable short identifier for this backend
 * httpbase  - base address of http service [see README for details]
 * type      - type of backend, must be 'polling' or 'binding'
 *
 * Optional object fields:
 * description     - a human readable description for this backend
 * servers_allowed - array of jabber server addresses users can connect to 
 *                   using this backend
 *
 * If BACKENDS contains more than one entry users may choose from a
 * select box which one to use when logging in.
 *
 * If 'servers_allowed' is empty or omitted user is presented an input
 * field to enter the jabber server to connect to by hand.
 * If 'servers_allowed' contains more than one element user is
 * presented a select box to choose a jabber server to connect to.
 * If 'servers_allowed' contains one single element no option is
 * presented to user.
 */
var BACKENDS = 
[
		{
			name:"zeank.darktech.org",
			description:"Local Ejabberd's HTTP Polling Backend",
			httpbase:"http-poll/",
			type:"polling",
			servers_allowed:['zeank.darktech.org']
		},
		{
			name:"Open Relay",
			description:"HTTP Binding Backend that Allows Connecting to any Jabber Server",
			httpbase:"/tomcat/JabberHTTPBind/",
			type:"binding",
		},
		{
			name:"Restricted Relay",
			description:"This one's for demonstrational purpose only",
			httpbase:"/tomcat/JabberHTTPBind/",
			type:"binding",
			servers_allowed:['zeank.darktech.org','jwchat.org']
		},
];

var timerval = 2000; // poll frequency in msec
var timeout = 150; // timeout of wcs

var stylesheet = "jwchat.css";
var THEMESDIR = "themes";

/* DEFAULTCONFERENCEGROUP + DEFAULTCONFERENCESERVER
 * default values for joingroupchat form
 */
var DEFAULTCONFERENCEROOM = "talks";
var DEFAULTCONFERENCESERVER = "conference.zeank.darktech.org";

/* debugging options */
var DEBUG = false; // turn debugging on
var DEBUG_LVL = 1; // debug-level 0..4 (4 = very noisy)

var USE_DEBUGJID = false; // if true only DEBUGJID gets the debugger
var DEBUGJID = "zeank@zeank.darktech.org"; // which user get's debug messages
