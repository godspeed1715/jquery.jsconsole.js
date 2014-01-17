var jsConsole = {
    timerNames: [],
     cssPanelBox: {
        'width': '100%',
        'color': '#000',
        'font-family': 'Courier',
        'font-size': '12px',
        'padding': '3px 0px 3px 0px',
        'position': 'fixed',
        'bottom': '-4px',
        'left': '0px',
        'opacity': '1.0',
        'z-index': '10000'
    },
    cssPanelDragBar: {
        'border-top': '3px solid #ededed',
        'border-bottom': '1px solid #ccc',
        'width': '100%',
        'cursor': 'row-resize'
    },
    cssPanelHeader: {
        'height': '24px',
        'background': '#ededed',
        'border-top': '1px solid #fff',
        'border-bottom': '1px solid #cacaca',
        'text-align': 'left',
        'font-family': 'Arial'  
    },
    cssPanelConsole: {
        'overflow': 'auto',
        'height': '150px',
        'padding': ' 0 5px 0 5px',
        'text-align': 'left',
        'background':'#fff'
    },
    cssPanelNavigation: {
        'height': '20px',
        'width': '100%',
        'background': '#ededed',
        'color': '#ededed',
        'border-top': '1px solid #cacaca'
    },
    isOn: false,
    init: function () {
        if ($("panel-box")) {
            var layout =  '<div id="panel-box">' +
                '  <div id="panel-dragbar"></div>' +
                '  <div id="panel-header">' +
                '       <span onclick="jsConsole.onOff();" id="panel-menu-disable">Disable</span> ' +
                '       <span onclick="jsConsole.clear();">Clear</span>  ' +
                '       <span id="panel-menu-transparent" onclick="jsConsole.transparent();">Transparent</span> ' +
                '       <span id="panel-menu-minimize" onclick="jsConsole.minimize();">Minimize</span> ' +
                '       <span id="panel-menu-close" style="float: right; margin-right: 5px; cursor: pointer; color: grey;"><i class="fa fa-times"></i></span> ' +
                '   </div>' + 
                '  <div id="panel-console"></div>' +
                '  <div id="panel-bottom-nav"></div>' +
                '</div>';
            var consolePanel = $(layout);
            $('body').append(consolePanel);
            $("#panel-box").css(this.cssPanelBox);
            $('#panel-dragbar').css(this.cssPanelDragBar);
            $('#panel-header').css(this.cssPanelHeader);
            $("#panel-console").css(this.cssPanelConsole);
            $("#panel-bottom-nav").css(this.cssPanelNavigation);
        };
        //Drapbar to expand panel-consle div
        $('#panel-dragbar').mousedown(function (e) {
            e.preventDefault();
            $(document).mousemove(function (e) {
                var height = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
                $('#panel-console').css("height", height - 48 - e.clientY);
            });
        });
        $(document).mouseup(function (e) {
            $(document).unbind('mousemove');
        });

        document.addEventListener('keydown', function(event) {
            var keyCode = event.which || event.keycode;
            if (keyCode == 123) { //F12 key is 123.
                jsConsole.toggle(); //call toggle function.
            }
        }, true);
        $('#panel-menu-close').bind({
            //Add a hover event for the close "x" in the panel header.
            mouseenter: function () {
                $(this).find('i').css("color", "black");
            },
            mouseout: function () {
                $(this).find('i').css("color", "grey");
            },
            click: function () {
                jsConsole.toggle(); //call toggle function.
            }
        });
        (function() {
          if (!window.console) {
            window.console = {};
          }
          console = window || window.console;
          // union of Chrome, FF, IE, and Safari console methods
          var method = [
            "log", "info", "warn", "onerror", "debug", "trace", "dir", "group",
            "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
            "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
          ];
          // define undefined methods as noops to prevent errors
          for (var i = 0; i < method.length; i++) {
            if (!window.console[method[i]]) {
                console[method[i]] = function() {

                    var sArguments = "";
                    for (var i = 0, j = arguments.length; i < j; i++){
                    sArguments += arguments[i] + " ";
                }
                if (method[i] === "onerror") {
                    var scriptNameURL = arguments[1]
                    if (scriptNameURL.match('/') || scriptNameURL.match('\\')) {
                        ExplodescriptName = scriptNameURL.split('/') || scriptNameURL.split('\\')
                        scriptName = ExplodescriptName[ExplodescriptName.length - 1];
                    } else {
                        scriptName = arguments[1];
                    }
                    jsConsole.log('<span style="color: red;"><i class="fa fa-times-circle"></i> <span>' + arguments[0] +'</span> <a href="' + scriptNameURL +'" class="pull-right">' + scriptName + ":" + arguments[2] + '</a></span>');
                } else {
                    jsConsole.log('<i class="fa fa-info-circle"></i> <span>' + sArguments + "</span>");
                }
                return true;
              };
            }    
          } 
        })();
        this.isOn = true;
    },
    log: function (msg, pause) {
        if (this.isOn === true) {
            $("#panel-console").append(msg + "<br>");
            if (pause !== undefined && pause === true) {
                alert("Click button to continue.");
            }
            //Scroll to bottom of textarea to simulate console
            this.consoleresize();
        }
    },
    consoleresize: function () {
        $("#panel-console").scrollTop($("#panel-console")[0].scrollHeight);
    },
      now: function () {
        var performance = window.performance ||{};
        performance.now = (function () {
            return performance.now    ||
            performance.webkitNow     ||
            performance.msNow         ||
            performance.oNow          ||
            performance.mozNow        ||
            function () { return new Date().getTime(); };
        })();
        return performance.now();
      },
    time: function (sTimerName) {
      this.timerNames.push({
        sTimerName : sTimerName,
        dStartTime: this.now()
      });
    },
    timeEnd: function (sTimerName) {
      if (this.timerNames.length !== 0 ) { 
        var dEndTime = this.now();
        for (var x = 0; x< this.timerNames.length; x++) {
          if (this.timerNames[x].sTimerName === sTimerName) {
             var TimerNameEnd = dEndTime - parseInt(this.timerNames[x].dStartTime, 10);
            this.log('<i class="fa fa-clock-o"></i> <span>' + JSON.stringify(this.timerNames[x].sTimerName).replace(/"/g,"") + ' ' + TimerNameEnd + '</span>');
          }
        }
      }
    },
    enable: function () {
        this.isOn = true;
    },
    disable: function () {
        this.isOn = false;
    },
    clear: function () {
        $("#panel-console").html("");
    },
    onOff: function () {
        if (this.isOn === false) {
            this.enable();
            $("#panel-menu-disable").html("Disable");
        }
        else {
            this.disable();
            $("#panel-menu-disable").html("Enable");

        }
    },
    transparent: function () {
        if ($("#panel-box").css("opacity") === "0.5") {
            $("#panel-box").css("opacity", "1.0");
            $("#panel-menu-transparent").html("Transparent");
        }
        else {
            $("#panel-box").css("opacity", "0.5");
            $("#panel-menu-transparent").html("Opaque");
        }
    },
    minimize: function () {
        if ($("#panel-console").css("display") === "block") {
            this.panelConsoleHeight = $('#panel-console').height();
            $("#panel-console").css({
                "height": "0px",
                "display": "none"
            });
            $("#panel-menu-minimize").html("Expand");
        }
        else {
            $("#panel-console").css({
                "height": this.panelConsoleHeight,
                "display": "block"
            });
            $("#panel-menu-minimize").html("Minimize");
            this.consoleresize();
        }
    },
    toggle: function () {
        if ($("#panel-box").css("display") == "block") {
            $("#panel-box").css("display", "none");
        }
        else {
            $("#panel-box").css("display", "block");
            this.consoleresize();
        }
  }
};


