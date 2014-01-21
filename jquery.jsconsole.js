var jsConsole = {
    timerNames: [],
    cmdHistory: [],
    cmdHistoryPosition: "",
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
     cssCommandLine: {
        'width': '95%',
        'padding':'5px',
        'border': 'none',
        'outline-width': '0px'
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
                '   <div id="panel-console"></div>' +
                '  <span id="panel-commandline">' +
                '       <span><i class="fa fa-chevron-right"></i></span><input id="commandline">' +
                '   </span>' +
                '   <div id="panel-bottom-nav"></div>' +
                '</div>';
            var consolePanel = $(layout);
            $('body').append(consolePanel);
            $("#panel-box").css(this.cssPanelBox);
            $('#panel-dragbar').css(this.cssPanelDragBar);
            $('#panel-header').css(this.cssPanelHeader)
                .find('span').css('cursor','pointer');
            $("#panel-console").css(this.cssPanelConsole);
            $('#panel-commandline, #commandline').css(this.cssCommandLine);
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
            if (event.keyCode == 123) {
                jsConsole.toggle();
            }
        }, true);
        $('#panel-menu-close').bind({
            mouseenter: function () {
                $(this).find('i').css("color", "black");
            },
            mouseout: function () {
                $(this).find('i').css("color", "grey");
            },
            click: function () {
                jsConsole.toggle();
            }
        });
       $('#commandline').on('keypress', function (event) {
           if ( event.which == 13) {
                var sCmd = $('#commandline').val();
                if (sCmd == "clear") {
                    jsConsole.clear();
                     jsConsole.cmdHistory.push(sCmd);
                    $('#commandline').val('');
                } else if (sCmd === "history"){
                    for (var x = 0; x < jsConsole.cmdHistory.length; x++) {
                        console.log(jsConsole.cmdHistory[x]);
                    }
                    $('#commandline').val('');
                } else if (sCmd) {
                     jsConsole.log('<span><i class="fa fa-chevron-right"></i> <span stle="margin-left: 18px;">' + sCmd +'</span>');
                     jsConsole.cmdHistory.push(sCmd);
                    try {
                        var evalCmd = eval(sCmd);
                        console.log(evalCmd);
                        $('#commandline').val('');
                    } catch(event) {
                        $('#commandline').val('');
                        throw event;
                    }
                }
                jsConsole.cmdHistoryPosition = jsConsole.cmdHistory.length;
             } 
        }).on('keydown', function (event) {
            if (event.which === 38) {
                jsConsole.cmdHistoryPosition--
                if (jsConsole.cmdHistoryPosition < 0) jsConsole.cmdHistoryPosition = 0; 
                if (jsConsole.cmdHistory[jsConsole.cmdHistoryPosition] != undefined && jsConsole.cmdHistory[jsConsole.cmdHistoryPosition] !== '') {
                    $('#commandline').val(jsConsole.cmdHistory[jsConsole.cmdHistoryPosition]);
                    return false;
                } else if (jsConsole.cmdHistoryPosition == jsConsole.cmdHistory.length) {
                    $('#commandline').val('');
                    return false;
                }
            } else if (event.which == 40) {
                jsConsole.cmdHistoryPosition++
                if (jsConsole.cmdHistoryPosition >= jsConsole.cmdHistory.length) jsConsole.cmdHistoryPosition = jsConsole.cmdHistory.length; //0
                if (jsConsole.cmdHistory[jsConsole.cmdHistoryPosition] != undefined && jsConsole.cmdHistory[jsConsole.cmdHistoryPosition] !== '') {
                    $('#commandline').val(jsConsole.cmdHistory[jsConsole.cmdHistoryPosition]);
                    return false;
                } else if (jsConsole.cmdHistoryPosition == jsConsole.cmdHistory.length) {
                    $('#commandline').val('');
                    return false;
                }            
            }
        })
        $('#panel-console').on('click', function () {
          $('#commandline').focus();
        });
          
          console = window //|| window.console;
          // union of Chrome, FF, IE, and Safari console methods
          var method = [
            "log", "info", "warn", "onerror", "debug", "trace", "dir", "group",
            "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
            "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear", "cmd"
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
                    } 
                    return true;
              };
            }    
          } 
          console = {
            clear: function () {
                jsConsole.clear();
            }, 
            cmd: function (arg) {
                jsConsole.log('<i class="fa fa-chevron-right"></i><span>' + arg + "</span>");
            }, 
            info: function (arg) {
                jsConsole.log('<i class="fa fa-info-circle"></i> <span>' + arg + "</span>");
            },
            log: function (arg) {
                jsConsole.log('<span style="padding-left: 18px;">' + arg + '</span>')
            },
            warn: function (arg) {
                jsConsole.log('<span style="color: yellow;"><i class="fa fa-warning"></i></span> <span>' + arg + '</span>')
            },
            error: function (arg) {
                throw arg;
            },
            time: function (sTimerName) {
              jsConsole.timerNames.push({
                sTimerName : sTimerName,
                dStartTime: jsConsole.now()
              });
            },
            timeEnd: function (sTimerName) {
              if (jsConsole.timerNames.length !== 0 ) { 
                var dEndTime = jsConsole.now();
                for (var x = 0; x< jsConsole.timerNames.length; x++) {
                  if (jsConsole.timerNames[x].sTimerName === sTimerName) {
                     var TimerNameEnd = dEndTime - parseInt(jsConsole.timerNames[x].dStartTime, 10);
                    jsConsole.log('<i class="fa fa-clock-o"></i> <span>' + JSON.stringify(jsConsole.timerNames[x].sTimerName).replace(/"/g,"") + ': ' + TimerNameEnd + '</span>');
                  }
                }
              }
            }
        }
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
        $("#panel-console").text("");
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


