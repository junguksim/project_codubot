/**
 Copyright 2014 Gordon Williams (gw@pur3.co.uk)

 This Source Code is subject to the terms of the Mozilla Public
 License, v2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 ------------------------------------------------------------------
  Handling the getting and setting of code
 ------------------------------------------------------------------
**/
"use strict";

(function(){

  var viewModeButton;
  var extractCodeButton, cleanCodeButton, sendCodeButton;

  function init() {
    // Configuration
    Espruino.Core.Config.add("AUTO_SAVE_CODE", {
      section : "Communications",
      name : "Auto Save",
      description : "Save code to Chrome's cloud storage when clicking 'Send to Espruino'?",
      type : "boolean",
      defaultValue : true,
    });

    // Setup code mode button
    viewModeButton = Espruino.Core.App.addIcon({
      id: "code",
      icon: "code",
      title : "Switch between Code and Graphical Designer",
      order: 0,
      area: {
        name: "code",
        position: "bottom"
      },
      click: function() {
        if (isInBlockly()) {
          switchToCode();
          Espruino.Core.EditorJavaScript.madeVisible();
        } else {
          switchToBlockly();
        }
      }
    });

    // Extract code from blocks and switch to code view
    extractCodeButton = Espruino.Core.App.addIcon({
      id: "code1",
      icon: "code",
      title : "Translate Blocks to Code",
      order: 1,
      //area: {
      //  name: "code",
      //  position: "bottom"
      //},
      click: function() {
        if (isInBlockly()) {
          switchToCode();
          Espruino.Core.EditorJavaScript.madeVisible();
        } else {
          //switchToBlockly();
        }
        Espruino.Core.EditorJavaScript.setCode(Espruino.Core.EditorBlockly.getCode());
      }
    });

    // Clean code view
    cleanCodeButton = Espruino.Core.App.addIcon({
      id: "code2",
      icon: "minus",
      title : "Clean Editor Screen",
      order: 5,
      //area: {
      //  name: "code",
      //  position: "top"
      //},
      click: function() {
        if (isInBlockly()) {
          Espruino.Core.EditorBlockly.setXML("");
        } else {
          Espruino.Core.EditorJavaScript.setCode("");
        }
      }
    });

    // Plus(+) code view
    cleanCodeButton = Espruino.Core.App.addIcon({
      id: "code3",
      icon: "plus",
      title : "Send Additional Code",
      order: 3,
      area: {
        name: "code",
        position: "top"
      },
      click: function() {
        if (isInBlockly()) {
          var code = Espruino.Core.EditorBlockly.getCode();
          if ( code.length > 500 ) {
            Espruino.Core.CodeWriter.codeAddToEspruino(code, function() {
              Espruino.Core.Terminal.addNotification("block download complete");
            });
          } else {
              Espruino.Core.Terminal.typeCharacters(code+"\n");
          }
        } else {
          var code = Espruino.Core.EditorJavaScript.getCode();
          if ( code.length > 500 ) {
            Espruino.Core.CodeWriter.codeAddToEspruino(code, function() {
              Espruino.Core.Terminal.addNotification("code download complete");
            });
          } else {
              Espruino.Core.Terminal.typeCharacters(code+"\n");
          }
        }
      }
    });

    
      // get code from our config area at bootup
      Espruino.addProcessor("initialised", function(data,callback) {
      var code;
      if (Espruino.Config.CODE) {
        code = Espruino.Config.CODE;
        console.log("Loaded code from storage.");
      } else {
        code = "print('initialised');"
        //code = "robot_move_angle(0,0,0,2,setTimeout(function(){print('move complete');},1300*2));robot_move_angle(1,0,0,2,setTimeout(function(){print('move complete');},1300*2));"
        //code = "function basic_mgmt(){var t=getTime();print(t);}\nfunction pause(p){var t=getTime()+p/1000;while(getTime()<t)basic_mgmt();}\nvar on=false;\nsetInterval(function(){\nprint('codu--------');pause(1000);print('codu========');\n},5000);";
        //code = "var  on = false;\nsetInterval(function() {\n  on = !on;\n  LED1.write(on);\n}, 500);";
        console.log("No code in storage.");
      }
      Espruino.Core.EditorJavaScript.setCode(code);
      callback(data);
    });

    Espruino.addProcessor("sending", function(data, callback) {
      if(Espruino.Config.AUTO_SAVE_CODE)
        Espruino.Config.set("CODE", Espruino.Core.EditorJavaScript.getCode()); // save the code
      callback(data);
    });
    // try and save code when window closes
    function saveCode(e) {
      if(Espruino.Config.AUTO_SAVE_CODE)
        Espruino.Config.set("CODE", Espruino.Core.EditorJavaScript.getCode());
    }
    window.addEventListener("close", saveCode);
    if (!Espruino.Core.Utils.isChromeWebApp()) // chrome complains if we use this
      window.addEventListener("beforeunload", saveCode);
  }

  function isInBlockly() { // TODO: we should really enumerate views - we might want another view?
    return $("#divblockly").is(":visible");
  };

  function switchToBlockly() {
    $("#divcode").hide();
    $("#divblockly").show();
    viewModeButton.setIcon("block");
    // Hack around issues Blockly have if we initialise when the window isn't visible
    Espruino.Core.EditorBlockly.setVisible();
  }

  function switchToCode() {
    $("#divblockly").hide();
    $("#divcode").show();
    viewModeButton.setIcon("code");
  }

  function getEspruinoCode(callback) {
    Espruino.callProcessor("transformForEspruino", getCurrentCode(), callback);
  }

  function getCurrentCode() {
    if (isInBlockly()) {
      return Espruino.Core.EditorBlockly.getCode();
    } else {
      return Espruino.Core.EditorJavaScript.getCode();
    }
  }

  Espruino.Core.Code = {
    init : init,
    getEspruinoCode : getEspruinoCode, // get the currently selected bit of code ready to send to Espruino (including Modules)
    getCurrentCode : getCurrentCode, // get the currently selected bit of code (either blockly or javascript editor)
    isInBlockly: isInBlockly,
    switchToCode: switchToCode,
    switchToBlockly: switchToBlockly
  };
}());
