if (typeof (SiebelAppFacade.gmaceEditorXMLPW) === "undefined") {

  /** The PW is used to diaply XML data in a fomated pre field.  It uses the ajaxorg/ace editor - JG-2020/05-R20.05 **/
  /** https://github.com/ajaxorg/ace-builds **/

  SiebelJS.Namespace("SiebelAppFacade.gmaceEditorXMLPW");
  define("siebel/custom/gmaceEditorPW", ["siebel/pwinfra",
                                             "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.9/ace.min.js",    
                                             "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.9/theme-xcode.js",
                                             "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.9/mode-xml.js",
                                             "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.9/mode-json.js"],
    function () {
      SiebelAppFacade.gmaceEditorPW = (function () {

        var gEditors = null;

        function gmaceEditorPW(pm) {
          SiebelAppFacade.gmaceEditorPW.superclass.constructor.apply(this, arguments);
        }

        SiebelJS.Extend(gmaceEditorPW, SiebelAppFacade.FieldPW);

        function FormatXML(aXML) {
          // Format XML
          aXML = aXML.replace("/t","").replace("/n","").replace("/r","");
          var lXML = aXML.replace(/>\s{0,}</g, '><').replace(/</g, '~::~<').replace(/\s*xmlns\:/g, '~::~xmlns:').replace(/\s*xmlns\=/g, '~::~xmlns=').split('~::~'),
              i = lXML.length,
              n = !1,
              r = 0,
              a = '',
              lShift = ['\n'];
          
          for (ix = 0; ix < 100; ix++) lShift.push(lShift[ix] + '  ');
          for (var s = 0; s < i; s++) - 1 < lXML[s].search(/<!/) ? (a += lShift[r] + lXML[s], n = !0, ( - 1 < lXML[s].search(/-->/) || - 1 < lXML[s].search(/\]>/) || - 1 < lXML[s].search(/!DOCTYPE/)) && (n = !1))  : - 1 < lXML[s].search(/-->/) || - 1 < lXML[s].search(/\]>/) ? (a += lXML[s], n = !1)  : /^<\w/.exec(lXML[s - 1]) && /^<\/\w/.exec(lXML[s]) && /^<[\w:\-\.\,]+/.exec(lXML[s - 1]) == /^<\/[\w:\-\.\,]+/.exec(lXML[s]) [0].replace('/', '') ? (a += lXML[s], n || r--)  : - 1 < lXML[s].search(/<\w/) && - 1 == lXML[s].search(/<\//) && - 1 == lXML[s].search(/\/>/) ? a = a += n ? lXML[s] : lShift[r++] + lXML[s] : - 1 < lXML[s].search(/<\w/) && - 1 < lXML[s].search(/<\//) ? a = a += n ? lXML[s] : lShift[r] + lXML[s] : - 1 < lXML[s].search(/<\//) ? a = a += n ? lXML[s] : lShift[--r] + lXML[s] : - 1 < lXML[s].search(/\/>/) ? a = a += n ? lXML[s] : lShift[r] + lXML[s] : - 1 < lXML[s].search(/<\?/) ? a += lShift[r] + lXML[s] : - 1 < lXML[s].search(/xmlns\:/) || - 1 < lXML[s].search(/xmlns\=/) ? a += lShift[r] + lXML[s] : a += lXML[s];
          return ('\n' == a[0] ? a.slice(1) : a);//.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function FormatJSON(aJSON) {
          // Format JSON
          var lJSON = $.parseJSON(aJSON);
          return(JSON.stringify(lJSON, null, "\t"));
        }

        gmaceEditorPW.prototype.Init = function () {
          SiebelAppFacade.gmaceEditorPW.superclass.Init.apply(this, arguments);
          
          gEditors = new Array();
        }

        gmaceEditorPW.prototype.ShowUI = function () {
          //SiebelAppFacade.gmaceEditorPW.superclass.ShowUI.apply(this, arguments);
  
          var lTemp     = "<pre id='%1' name='%2' style='height:%3px; width:auto; max-width:%4px; margin:0; overflow:hidden;'></pre>";
          var lElName   = this.control.GetInputName();
          var lEls      = this.GetEl(undefined, !0)
          var lId,lName = "";
          var lElApplet = $("#"+this.control.GetApplet().GetFullId());
 
          if (!lEls) return; 

          for (var i=0;i<lEls.length;i++) {
            lName = lEls[i].name;
            lId   = lEls[i].name + "_" + i;

            //$(lEls[i]).replaceWith(lTemp.replace("%1",lId).replace("%2",lName).replace("%3",this.control.GetHeight()).replace("%4",this.control.GetWidth()));
            $(lEls[i]).replaceWith(lTemp.replace("%1",lId).replace("%2",lName).replace("%3",lElApplet.height()-20).replace("%4",lElApplet.width()-20));

            gEditors[lId] = ace.edit(lId);
            gEditors[lId].setTheme("ace/theme/xcode");
            gEditors[lId].session.setMode("ace/mode/xml");
            gEditors[lId].setOption("showPrintMargin", false);
            gEditors[lId].setOption("tabSize", 2);
          }
        }

        gmaceEditorPW.prototype.GetValue = function () {
          //var retVal = SiebelAppFacade.gmaceEditorPW.superclass.GetValue.apply(this, arguments);
          
          var lEls   = this.GetEl(undefined, !0)
          var retVal = gEditors[index].getValue().replace("/n","").replace("/t","");
          return (retVal);
        }

        gmaceEditorPW.prototype.SetValue = function (value, index) {
          //SiebelAppFacade.gmaceEditorPW.superclass.SetValue.apply(this, arguments);

          var lEls   = this.GetEl(index);
          var lValue = "";
          try {
            lValue = FormatJSON(value);
            gEditors[lEls[0].id].session.setMode("ace/mode/json");
          } catch(e) {
            lValue = FormatXML(value);
            gEditors[lEls[0].id].session.setMode("ace/mode/xml");
          }
          gEditors[lEls[0].id].setValue(lValue);
        }

        gmaceEditorPW.prototype.EndLife = function () {
          
          var lName = "";
 
          for (lName in gEditors) {
            if (lName != "CleanEmptyElements") {
              gEditors[lName].destroy();
              gEditors[lName].container.remove();
              gEditors[lName] = null;
            }
          }

          SiebelAppFacade.gmaceEditorPW.superclass.EndLife.apply(this, arguments);
         }

        return gmaceEditorPW;
      }()
    );
  
    SiebelApp.S_App.PluginBuilder.AttachPW(consts.get("SWE_CTRL_TEXTAREA"), SiebelAppFacade.gmaceEditorPW, function (control, objName) {
      return control.GetName().indexOf('gmaceEditorXML') > -1;
    return true;
    });
    return "SiebelAppFacade.gmaceEditorPW";
  })
}
