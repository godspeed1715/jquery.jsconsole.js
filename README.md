jquery.jsconsole.js
===============

jsConsole is a Javascript Console Log for HTAs (HTML Applications) which works with jQuery to implement console.log, console.info, and console.error. It will also log errors that would normally appear in a popup box. It is a tool for developing HTAs that once you start using is impossible to stop, because it increases HTA development productivity and decreases development time. Never again use alert() to debug your HTA application. It's currently in APLHA and needs some work but is in a stable state and is currently useable. The jsConsole.js file is only 15 KB and incorporates all the requried features that a develeoper needs to adequately develop and debug an HTA application.

##How to install and initialize

Place the script file in your main HTA file
```html
<script src="./Path/To/jsconsole.js"></script>
```

To initilize the console
```javascript
jsConsole.init();
```

To toggle the console, press F12

To toggle the console onload place this code after jsConsole.init()
```javascript
jsConsole.toggle();
```

##Features
* Ability to use console.* for debugging
* time() and timeEnd() to find execution time of function or scripts.
* Ability to enter commands within the console to debug scripts, and functions.
* Command History (Type history in the console.)
* Clearing of console log (Type clear in the console.)
* Ability to toggle console by either the F12 key or by using the toggle method of jsConsole ie. jsConosle.toggle()

##Dependencies
* jQuery
* FontAwesome

##Credit

The original plugin was created by <a href="http://code.technolatte.net/jsLog/">Serkan Karaarslan</a>. This is currently a fork of his initial code, and hopes to provide additional features.

The performance.now shim was taken from <a hreh="http://codingjohnson.com/javascript-precision-timing#.UtMcw_RDv1Y">Coding Johnson</a>.
