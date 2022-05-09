/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
'use strict';

if (!Array.prototype.includes) {   
  // polyfill for IE11
  Object.defineProperty(Array.prototype, "includes", {
    enumerable: false,
    value: function(obj) {
      for (var ind = 0; ind < this.length; ind++) 
      {
        if (this[ind] === obj)
          return true;
      }
      return false;
    }
  });
}


$.widget("ibi.aceEditor", $.ibi.ibxWidget, 
{
  options:
  {  
    config: 
    {
      // Default values for Ace editor opts. 
      // Configurable throughout the duration of the session via option()
      "theme":"light",
      "mode": null,
      "showFoldWidgets":true,
      "useWorker": false, // true if ACE will use worker file for syntax errors
      "wrapMode": false,    
      "useAutoCompleteLocalStrs": true, // true if local strings are to be 
                                        // included in autocomplete sugg. list.
                                        // ACE will incl strs in comments too
      "displayIndentGuides":false,
      "showPrintMargin":false,
      "showLineNumbers":true,
      "showGutter":true,
      "highlightActiveLine":true,
      "readOnly":false,
      "enableBasicAutocompletion": true,  // option: autocompl via Ctrl+space
      "enableLiveAutocompletion": false,
      "enableSnippets": false,
      "autoIndenting": true,
      "foldStyle": "markbeginend"
    },

    props: 
    {
      // Properties settable when creating widget
      filetype: '',         // file extension
      diffkind: null,       // for diff only: "diff" or "merge"
      content: '',          // content buffer for non-diff/merge or lhs diff
      rightContent: null,   // for diff/merge only: content for right-side sess
      tstampDiv: null,      // for *.log only: container div for timestamp cont
      tstampContent: null,  // timestamp content
      keyToggle508: true,   // TAB navigation toggling via ESC is on by default.
      set508modeCB : null,  // callback when 508 mode entered/exited
      disabledHotKeys: ["ctrl-f", "ctrl-h", "ctrl-l"],  // list of ACE hotkeys to disable.
      contextMenuCB: null,  // callback for custom context menu
      custFoldOffCB: null,  // callback for turning off all custom folding checkboxes
      statusBar: false,     // true if status bar is being used in container
      topBorder: false,     // true if top border needed
    }
  },

  findFilterFolds : [],   

  modeFileBase : "ace/mode/",

  /** Type of session.
      @typedef {("default"|"left"|"right"|"tstamp")} editSessionType
   */
  editSessionTypes : ["default", "left", "right", "tstamp"],

  caseChangeTypes : ["toUpper", "toLower"],

  ftypList : {   // if filetype has comments,  add it to fTypesHaveComments[] 
              "fex":  "focexec",
              "log":  "focexec",
              "mas":  "master",
              "edp":  "edaprint",
              "trc":  "edatrace",
              "py":   "python",
              "js":   "javascript",
              "css":  "css",
              "htm":  "html",
              "html": "html",
              "sql":  "sql",
              "xml":  "xml",
              "json": "json"
            },

  fTypesHaveComments : ["focexec", "master", "python", "javascript",
                       "css", "html", "sql", "xml"],
	
  _widgetClass:"wf-ace-text-editor",
	
  _create:function()
  {
    this._super();

    var opts = this.options;

    var editor_obj = this;

    var containerEl = $(this.element).parent();

    this.eds = [];

    if (((opts.props.diffkind !== null) && (opts.props.rightContent === null)) ||
        ((opts.props.diffkind === null) && (opts.props.rightContent !== null)))
    {
      console.error("Diff/merge session needs both diffkind and rightContent.");
      return;
    }
    
    if (((opts.props.tstampDiv !== null) && (opts.props.tstampContent === null)) ||
        ((opts.props.tstampDiv === null) && (opts.props.tstampContent !== null)))
    {
      console.error("Log session with timestamp needs both tstampDiv and tstampContent.");
      return;
    }

    if ((opts.config.mode === null) && opts.props.filetype && 
        (this.ftypList[opts.props.filetype] !== undefined))
    {
      opts.config.mode = this.modeFileBase + this.ftypList[opts.props.filetype];
    }

    this.themeBase = "ace/theme/wc";
    this.themeName = {"light" : "default",
                      "dark"  : "cobalt"};
    this.themeLight = this.themeBase + this.themeName.light;
    this.themeDark  = this.themeBase + this.themeNamedark;
    this.classThemeBase = "ace-wc";
    this.classLight = this.classThemeBase + this.themeName.light;
    this.classDark = this.classThemeBase + this.themeName.dark;

    var that = this;

    if (opts.props.diffkind === null)
    {
      this._insertKeyStatus = true;
	  
      this._ace_editor = ace.edit(this.element[0]);  
      this.eds.push(this._ace_editor);
    
      if (opts.props.statusBar === true)
      {
        this._ace_editor.getSession().selection.on('changeCursor', this._onEditorAreaChangeCursorEvent.bind(this));  
        this._ace_editor.textInput.getElement().addEventListener("keydown", this._onKeyDown.bind(this), false);  
        this._ace_editor.textInput.getElement().addEventListener("keypress", this._onKeyPress.bind(this), false);  
      }

      this._ace_editor.session.on('change', this.onUndoManagerChange.bind(this));    
      //this._ace_editor.getSession().getUndoManager.on('change', this.onUndoManagerChange.bind(this));  
	  
      this.content(opts.props.content);
      this._ace_editor.focus();

      if (opts.props.tstampDiv !== null)
      {
        this._ace_tstamp_div = opts.props.tstampDiv;
        this._timeStampColumn(editor_obj._ace_tstamp_div[0].id, opts.props);
      }

      if (opts.config.readOnly === false) 
        this._getCompleters();

      this._initOptions(this.options);

      var obj = containerEl;
      var zindex = obj.css("z-index");
      while ( zindex === "auto" )
      {
          obj = obj.parent();
          if (( !obj ) || (obj[0] && (obj[0].ownerDocument === null)))
            break;
          zindex = obj.css("z-index");
      }
      if ( zindex !== "auto" )
          this._ace_editor.getSession().autocomp_zindex = zindex;

      if (opts.props.filetype === "log")
        this._scrollToBottom(); // scroll to bottom of log upon session open

      this._event508bind(this.eds);

      // Clear undo stack so that undo w/o any changes will not erase buffer.
      editor_obj._ace_editor.session.getUndoManager().reset(); 

      if (opts.props.topBorder === true)
        $(this.element).addClass("wf-ace-top-border");		
    }
    else //  A diff or merge session
    {
      $(this.element).addClass("ace_editor");
      var showCopyArrows = (opts.props.diffkind === "merge") ? true : false;
          
      var aceDiff = new AceDiff.AceDiff({
        mode: null,
        theme: this.themeBase + this.themeName['light'], // initial theme
        element: "#" +  this.element[0].id,
        diffGranularity: 'specific',
        lockScrolling: false, // acediff functionality not implemented yet.
                              // lock scrolling is done in this widget instead.
        showDiffs: true,
        showConnectors: true,
        maxDiffs: 5000,
        left: {
          id: null,
          content: opts.props.content,
          mode: null,
          theme: null,
          editable: false,
          copyLinkEnabled: showCopyArrows,
        },
        right: {
          id: null,
          content: opts.props.rightContent,
          mode: null,
          theme: null,
          editable: false,
          copyLinkEnabled: showCopyArrows,
        },
        classes: {
          gutterID: 'acediff__gutter',
          diff: 'acediff__diffLine',
          connector: 'acediff__connector',
          newCodeConnectorLink: 'acediff__newCodeConnector',
          newCodeConnectorLinkContent: '&#8594;',
          deletedCodeConnectorLink: 'acediff__deletedCodeConnector',
          deletedCodeConnectorLinkContent: '&#8592;',
          copyRightContainer: 'acediff__copy--right',
          copyLeftContainer: 'acediff__copy--left',
       },
        connectorYOffset: 0,
      });

      this.aceDiff = aceDiff;
      aceDiff.copyStack = []; /* stack of all copy actions' directions */
      aceDiff.copyStackInd = 0;

      aceDiff.copyLeftStr  = ibx.resourceMgr.getString('aceeditor.diff_copyleft');
      aceDiff.copyRightStr = ibx.resourceMgr.getString('aceeditor.diff_copyright');

      this.aceDiff = aceDiff;

      var diffeds = aceDiff.getEditors();
      this.diffeds = diffeds;

      this.eds.push(diffeds.left, diffeds.right);

      this.lastEdWithFocus = "left";

      $.each(this.eds, function(i,ed) {
        ed.addEventListener("blur", that._setLastFocus.bind(ed, that));
      });

      $(containerEl).find('[class^=acediff__]').addClass("ace-wc" + this.themeName.light);

      this.diff_left_scroll_div = 
        $(containerEl).find('.acediff__left').find('.ace_scrollbar-v');
      this.diff_right_scroll_div = 
        $(containerEl).find('.acediff__right').find('.ace_scrollbar-v');

      this.diff_left_scroll_div.scrollCalled = false;
      this.diff_right_scroll_div.scrollCalled = false;

      this.lr_offset = 0;

      this.diffeds.left.focus();

      $.each(this.eds, function(i,ed) { ed.setShowFoldWidgets(false); });
  
      opts.config.readOnly = true; // diff/merge sessions are readonly

      this._initOptions(this.options);

      this._syncDiffScrolling("on");

      var diffsWait = setInterval(function() {
        if (this.aceDiff.diffs) 
        {
          clearInterval(diffsWait);
          this.jumpToDiff("next"); // scroll to 1st diff
        }
      }.bind(this), 20);
    }

    $(this.element).css("visibility", "visible");

    var popup_par = containerEl.closest(".ibx-popup");
    if (popup_par.length)
      this.ppar = popup_par; // Editor is inside popup. Resize when popup is resized
    else
      this.ppar = $(this.element).parent().parent();

    this.ppar.on("resize", function(evt) {
      if (editor_obj.options.props.tstampDiv !== null)
      {
        editor_obj._refresh(editor_obj.eds[0]);
        editor_obj._syncTstampHeight();
      }
      else
        editor_obj._refresh();
    });

    var stopPropag = function(evt) { evt.stopPropagation(); } ;


    if (this.options.config.mode !== null)
      this._setMode(this.options.config.mode);

    $.each(this.eds, function(i,ed) {
       ed.addEventListener("mousedown", stopPropag);
       ed.container.addEventListener("contextmenu", 
             opts.props.contextMenuCB ? opts.props.contextMenuCB : stopPropag);
       ed.setShowPrintMargin(opts.config.showPrintMargin);
       ed.setDisplayIndentGuides(opts.config.displayIndentGuides); 
       var key;
       for (key in ed.keyBinding.$defaultHandler.commandKeyBinding) {
         if (opts.props.disabledHotKeys.includes(key))
           delete ed.keyBinding.$defaultHandler.commandKeyBinding[key];
       };
       ed.session.on("changeFold", function(e, session) {
          if ((e.action === "remove") &&
              ((document.activeElement.tagName === "TEXTAREA") ||
               (document.activeElement.tagName === "INPUT")))
          {
            // One folded section was unfolded. Turn off all custom fold 
            // checkboxes, if any, since setting may no longer apply.
            if (that.options.props.custFoldOffCB !== null)
              that.options.props.custFoldOffCB();
          }
        });
    });
  },

  // Synchronize scrolling of left/right editors after one scrolled.
  //   default action: "on"
  _syncDiffScrolling: function(action) {

      if (action !== undefined && action === "off")
      {
        this.diff_left_scroll_div.off('scroll');
        this.diff_right_scroll_div.off('scroll');
        return;
      }

      var edobj = this;

      // sync left / right scrollbars   
      if ( this.diff_left_scroll_div.length &&
           this.diff_right_scroll_div.length)
      {
        this.diff_left_scroll_div.on('scroll', function () {
          if (!edobj.diff_left_scroll_div.scrollCalled) {
            edobj.diff_right_scroll_div.scrollCalled = true;
            var left_st = edobj.diffeds.left.session.getScrollTop();
            edobj.diffeds.right.session.setScrollTop(left_st - edobj.lr_offset);
          }
          edobj.diff_left_scroll_div.scrollCalled = false;
        });

        this.diff_right_scroll_div.on('scroll', function () {
          if (!edobj.diff_right_scroll_div.scrollCalled) {
            edobj.diff_left_scroll_div.scrollCalled = true;
            var right_st = edobj.diffeds.right.session.getScrollTop();
            edobj.diffeds.left.session.setScrollTop(right_st + edobj.lr_offset);
          }
          edobj.diff_right_scroll_div.scrollCalled = false;
        });
      }
  },

  // Keep track of diff session (left or right) that had focus last.
  _setLastFocus:function(edobj, evt)
  {
    if ($(this.container).hasClass("acediff__right"))
      edobj.lastEdWithFocus = "right";
    else
      edobj.lastEdWithFocus = "left";

    return;
  },
  
  _destroy:function()
  {
    this._super();
    this.ppar.off("resize"); 
    this.fbox.off("input");
    $.each(this.eds, function(i,ed) {
          ed.destroy();
    });
    this._ace_editor = null; 
    this.eds = null;
  },

  _refresh:function(ed)
  {
    this._super();
    var eds = (ed === undefined) ? this.eds : [ed];
 
    $.each(eds, function(i,ed) {
        ed.resize(true);
    });
  },

  _initOptions : function(options)
  {
    this._setOptions(options);
    this._setOptions(options.config);
  },


  refreshEditor:function()
  {
    this._refresh();
  },


  /** Jump to previous or next diff.
      @param {string} which - action: prev or next
  */
  jumpToDiff:function(which)
  {
    if (this.options.props.diffkind === null)
      return;

    this.focus(this.lastEdWithFocus);

    var pos = this.getEditor(this.lastEdWithFocus).getCursorPosition();
    var newDiff = null;
    var prev_offs = (which === "prev") ? 1 : 0;

    // Find next/prev diff in the diff list
    this.aceDiff.diffs.some(function(el) {
      var startline = (this.lastEdWithFocus === "left") ? 
        el.leftStartLine : el.rightStartLine;
      if (startline > (pos.row - prev_offs))
      {
        if (which === "next")
          newDiff = el;
        return true;
      }
      newDiff = el;
      }.bind(this));

    if (newDiff !== null)
    {
      this._syncDiffScrolling("off"); // disable left/right sync

      // scroll to 1st line of diff on left and right sides & move cursor pos
      this.cursorPos("left",  { row: newDiff.leftStartLine, column: 0 });
      this.cursorPos("right", { row: newDiff.rightStartLine, column: 0 });

      // wait for scroll to render
      $().ready(function() {
        var newLeftScrollTop  = this.diffeds.left.session.getScrollTop();
        var newRightScrollTop = this.diffeds.right.session.getScrollTop();

        this._syncDiffScrolling("on"); // re-enable left/right sync

        // lr_offset is distance between left and right session scrolltops 
        // for the current diff. This remains fixed until another jump occurs
        this.lr_offset = newLeftScrollTop - newRightScrollTop;
      }.bind(this));
    }

    return;
  },
	
	
  /** Set/get editor options. If not getting an ACE option, 
      pass on parms to super.
  */
  option: function(key, value, refresh)
  {
    if ((arguments.length === 1) && (typeof arguments[0] === "string"))
      return this._getOption(key);  // jQuery-style get for settable opt
    else
      return this._super(key, value, refresh);
  },


  /* Set editor options.
      param {object} opts - option(s) to set.
  */
  
  _setOptions: function(opts)
  {
    if (typeof opts === 'object')
    {
      for (var key in opts) 
      {
        if (key === "theme")
          this._setTheme(this.themeBase + this.themeName[opts[key]]);
        else if (key === "mode")
          this._setMode(opts[key]);
        else if (key === "showFoldWidgets") 
        {
          $.each(this.eds, function(i,ed) {
            ed.setShowFoldWidgets(opts[key]);
          });
        }
        else if (key === "useWorker")  // to do: regular set w/ useWorker()?
        {
          $.each(this.eds, function(i,ed) { 
               ed.session.setUseWorker(opts[key]);});
        }
        else if (key === "wrapMode")
        {
          $.each(this.eds, function(i,ed) { 
               ed.session.setUseWrapMode(opts[key]);});
        }
        else if (key === "useAutoCompleteLocalStrs")
          this._autoCompleteLocalStrs(opts[key]);
        else if ((key === "showGutter") && (this.options.props.tstampDiv !== null))
          this.eds[0].setOption(key, opts[key]); // tstamp col has no line #s
        else
        {
          if (this.options.config[key] !== undefined)
          {
            // it's an Ace option that ACE will set via its own setOption
            $.each(this.eds, function(i,ed) {
              ed.setOption(key, opts[key]);
            });
          }
          else if ((key !== "props") && (key !== "config"))
          {
            var dummyel = {};
            dummyel[key] = opts[key];
            this._super(dummyel);
          }
        }
      }
    }
  },

  /* Get editor option.
      param {string} opt - option to get.
      returns {object|string}
  */
  _getOption: function(opt)
  {  
    if (opt !== undefined)
    {
      if (opt === "theme")
      {
        var th = this.eds[0].getTheme();
        var aceTheme = th.substring(th.lastIndexOf('/') + 3); // past the 'wc'
        for (var thkey in this.themeName)
        {
          if (this.themeName[thkey] === aceTheme)
            return thkey;
        }
        return undefined;
      }
      else if (opt === "mode")
        return (this.eds[0].session.$modeId);
      else if (opt === "showFoldWidgets")
        return (this.eds[0].getShowFoldWidgets());
      else if (opt === "useWorker")
        return (this.eds[0].session.getUseWorker());
      else if (opt === "wrapMode")
        return (this.eds[0].session.getUseWrapMode());
      else if (opt === "useAutoCompleteLocalStrs")
        return this._autoCompleteLocalStrs();
      else if (this.options.config[opt] !== undefined)
        return (this.eds[0].getOption(opt));
      else
        this._super(opt);
    }
    else
      return undefined;   
  },

  _autoCompleteLocalStrs : function(setting)
  { 
    if (this._getOption("readOnly") === false)
    {
      if (setting !== undefined)
      { 
        // set
        if (setting === true)  // show "local" autocompletion suggestions
          this._ace_editor.completers = [this.snippetComp, 
                                         this.localComp, 
                                         this.keywordComp];
        else     //  remove "local" autocompletion suggestions
         this._ace_editor.completers = [this.snippetComp, 
                                        this.keywordComp];
      }
      else  // get
        return (this._ace_editor.completers.length === 3 ? true : false);
    }
    else
      return undefined;
  },

  _getCompleters : function()
  {
    var temp_auto_enable = false;
    if ((this._getOption("enableBasicAutocompletion") === false) &&
        (this._getOption("enableLiveAutocompletion") === false))
    {
      temp_auto_enable = true;  // autocompletion must be on to access completers
	  $.each(this.eds, function(i,ed) { ed.setOption("enableLiveAutocompletion", true); });
    }
    this.snippetComp = this._ace_editor.completers[0];
    this.localComp   = this._ace_editor.completers[1];
    this.keywordComp = this._ace_editor.completers[2];
	
    if (temp_auto_enable)
      $.each(this.eds, function(i,ed) { ed.setOption("enableLiveAutocompletion", false); });
  },
 

  _event508bind : function(eds)
  {
    var widobj = this;
    $.each(eds, function(i,ed) { 
      ed.tab508mode = false;
      if (widobj.options.props.keyToggle508 === true)
      {
        // If diff/merge: 'esc' enters 508 mode for both read-only left/right
        // diff sessions, so just pass in left (eds[0]) for either side. 
        // For !diff/merge, eds[0] is the only ace session.
        ed.container.addEventListener('keydown', 
                          widobj._keyEvent508check.bind(eds[0], widobj));
      }
    });
  },

  _keyEvent508check : function(widobj, evt) { 
    if(evt.key=='Escape'||evt.key=='Esc'||evt.keyCode==27) {
      evt.preventDefault();
      evt.stopPropagation();
      var readOnly = widobj._getOption("readOnly");
      if (readOnly === false)
      {
        // if tab508mode === true, ace.js key handler eats tab.
        this.tab508mode = !this.tab508mode;
      }
      if (widobj.options.props.set508modeCB !== null)
        widobj.options.props.set508modeCB(this.tab508mode, readOnly);
    } 
  },

  /** Toggle 508 mode
      @param {boolean} mode - true or false
  */
  set508mode : function(mode)
  {
    if ((mode === undefined) || (typeof mode !== 'boolean'))
      return;

    // diff sessions are read-only and should not have a 508 mode switch
    if (this.options.props.diffkind !== null)
      return;  

    this._ace_editor.tab508mode = mode;
    if (this.options.props.set508modeCB !== null)
      this.options.props.set508modeCB(this._ace_editor.tab508mode, 
                                      this._getOption("readOnly"));
  },


  // Set the syntax mode of all related edit sessions. 
  //    @param {string} mode - a valid mode in the form ace/mode/xxx, where xxx 
  //    is part of the name of the mode file: mode-xxx.js
  _setMode: function(mode) 
  {
    $.each(this.eds, function(i,ed) { ed.session.setMode(mode); });
  },

  // Set theme of all related sessions.
  //    @param {string} theme_new - a valid theme in the form ace/theme/xxx,
  //    where xxx is part of the name of the theme file: theme-xxx.js
  _setTheme : function(theme_new) 
  {
    var theme_old = this.eds[0].getTheme();
    if (theme_old !== theme_new)
    {
      if (this.options.props.diffkind !== null)
      {
        var containerEl = $(this.element).parent();
        $.each(this.eds, function(i,ed) { ed.setTheme(theme_new); })
    
        // diff session's gutter elements need to have old theme class removed
        var class_new, class_old;
        if (theme_old === this.themeLight)
        {
          class_old = this.classLight;  class_new = this.classDark;
        }
        else
        {
          class_new = this.classLight;  class_old = this.classDark;
        }

        $(containerEl).find('.' + class_old).removeClass(class_old).addClass(class_new);
      }
      else
      {
        $.each(this.eds, function(i,ed) { ed.setTheme(theme_new); });
      }
    }
  },


  /** Get editor object
      @param {editSessionType} whichEd - editor session
      @returns {object} ACE editor context
  */
  getEditor:function (whichEd)
  {
    var ed;
    if (whichEd !== undefined) 
    {
      if (!this.editSessionTypes.includes(whichEd))
      {
        console.error("Edit session type '" + whichEd +"' is not valid.");
        return (undefined);
      }

      if (whichEd === "tstamp")
        ed = this._ace_tstamp;
      else if  (whichEd === "left")
        ed = this.diffeds.left;
      else if  (whichEd === "right")
        ed = this.diffeds.right;
      else  // "default"
        ed = this._ace_editor ? this._ace_editor : this.eds[0]; 
    }
    else
      ed = this._ace_editor ? this._ace_editor : this.eds[0]; 

    return (ed);
  },


  /** Set/Get content of default edit session buffer.
      If content is defined, method is a setter. Otherwise, 
      method returns the content of the session buffer.
      @param {string} content - text to edit for setting; unused for getting.
      @returns {string} content if getting, or undefined if setting.
  */
  content:function(content)
  {
    return (this.contentAny("default", content));
  },

  /** Set/Get content of specified edit session buffer. 
      If content is defined, method is a setter. Otherwise, method returns 
      the content of the session buffer.
      @param {editSessionType} whichEd - editor session
      @param {string} content - text to edit for setting; unused for getting.
      @returns {string} content if getting, or undefined if setting.
  */
  contentAny:function(whichEd, content)
  {
    var ed = this.getEditor(whichEd);

    if (ed)
    {
      if (content !== undefined)
        return ed.setValue(content, -1);
      else
        return ed.getValue();
    }
    return (undefined);
  },

  /** Clear (deselect) the current selection.
      @param {editSessionType} whichEd - editor session
  */
  clearSelection:function(whichEd)
  {
    this.getEditor(whichEd).clearSelection();
  },

 /** Delete all text in the current selection.
      @param {editSessionType} whichEd - editor session
  */
  deleteSelection:function(whichEd)
  {
    var ed = this.getEditor(whichEd);
    ed.session.replace(ed.selection.getRange(), "");  
  },


  /** Set focus on edit session.
      @param {editSessionType} whichEd - editor session
  */
  focus:function(whichEd)
  {
    var ed = this.getEditor(whichEd);
    ed.focus();
  },

  /** Fold all text around blocks that start with a keyword specified
      in custfoldstr list. 
      Custfoldstr is an object of the form 
        { MYKEY : [foldbool, container_props, ...], 
          MYKEY2: [foldbool, container_props, ...],   ... }
     This method only uses 1st array member (the fold boolean) for each key. 
     @param {object}   custfoldstr - object containing custom fold strs
     @param {function} excepCB - callback to allow folding around blocks that
     do not follow the simple "^\\s*mykeyword" rule.
  */
  customFold : function(custfoldstr, excepCB) {
    var edobj = this;
    var ed_sess = edobj._ace_editor.session;
    var i;
    var nrange, prevrange;
    var Range = ace.require('ace/range').Range;
    var fold;
    var prev_line = 0;
    var len = edobj._ace_editor.getSession().getLength();
    var prev_cmdShowEndRow = -1;

    if ((this.options.props.diffkind !== null) || (custfoldstr === undefined))
      return;

    // unfold all previous custom folds, if any
    this.unfoldAll();

    var fold_on = false;
    for (var key in custfoldstr) {
      if (custfoldstr[key][0] === true)
      {
        fold_on = true;
        break;
      }
    }

    if (fold_on === false)
      return;   // no custom folds chosen, nothing to fold

    var row;
    for ( row = 0; row < len; row++)
    {
      var afold = ed_sess.getFoldWidget(row);

      var line = ed_sess.getLine(row);

      if ((afold) || excepCB(custfoldstr, line))
      {
        for (var key in custfoldstr)
        {
          if ((custfoldstr[key][0] === true) && 
              (line.match("^\\s*" + key)))
          {
            var cmdShowRange;
            if (afold)
              cmdShowRange = ed_sess.getFoldWidgetRange(row);
            else
              cmdShowRange = new Range(row, 0, row, ed_sess.getLine(row).length);

            var prev_line = row - 1; // last line of block to be folded

            if ((row > 0) && (prev_line > prev_cmdShowEndRow))
            {
              if ((prev_line > (prev_cmdShowEndRow + 1)) ||
                  ((prev_line == (prev_cmdShowEndRow + 1)) &&
                   (ed_sess.getLine(prev_line).length > 1)))//ACE can't fold 1 char 
              {
                var newFoldRange = new Range (
                                 prev_cmdShowEndRow + 1, 0, 
                                 prev_line, ed_sess.getLine(prev_line).length);
                ed_sess.addFold(".........", newFoldRange);
              }
            }
            prev_cmdShowEndRow = row = cmdShowRange.end.row;
            break;
          }
        }
      }
    }

    if ((prev_cmdShowEndRow < len - 2) || 
        ((prev_cmdShowEndRow === len - 2) && (ed_sess.getLine(len - 1).length) > 1))
    {
      // add fold after last shown cmd
      var newFoldRange = new Range (prev_cmdShowEndRow + 1, 0, 
                                    len - 1, ed_sess.getLine(len - 1).length);
      ed_sess.addFold(".........", newFoldRange);
    }
  },


  // Sync timestamp session's height with log session's height. Show/hide
  //     tstamp session's horiz scrollbar if log's horiz scrollbar has been
  //     shown/hidden.
  _syncTstampHeight : function()
  {
    var edobj = this;
    $(this.element).ready(function() {
      var scroller  = $(edobj.element).find(".ace_scroller");
      var hbar        = $(edobj.element).find(".ace_scrollbar-h");
      var hbar_vis    =  hbar.is(':visible');
      var ts_hbar_vis =  $(edobj._ace_tstamp_div).find(".ace_scrollbar-h").is(':visible');

      if (hbar_vis && ts_hbar_vis)
        edobj._ace_tstamp.container.style.height = 
                        $(edobj.element).height() + "px";
      else 
      {
        var hbar_height;
        if (hbar_vis)  
          hbar_height = hbar[0].offsetHeight - hbar[0].clientHeight;
        else
          hbar_height = 0;

        edobj._ace_tstamp.container.style.height = 
                scroller[0].offsetHeight - hbar_height + "px";
      }
      edobj._refresh(edobj._ace_tstamp);
    });
  },

	
  /** undo last edit operation
  */
  undo : function()
  {
    if ((this._getOption("readOnly") === false) || 
        (this.options.props.diffkind == 'merge'))
    {
      var ed;
      if (this.options.props.diffkind !== null)
      { 
        if (this.aceDiff.copyStack[this.aceDiff.copyStackInd])
        {
          if (this.aceDiff.copyStack[this.aceDiff.copyStackInd] === "toLeft")
            ed = this.diffeds.left;
          else if (this.aceDiff.copyStack[this.aceDiff.copyStackInd] === "toRight")
            ed = this.diffeds.right;
          this.aceDiff.copyStackInd++;
        }
        else
          return;
      }
      else
        ed = this._ace_editor;

      if(ed.session.getUndoManager().hasUndo())
        ed.session.getUndoManager().undo();
      ed.focus();
    }
  },

  /** Redo a change from undo stack
  */
  redo : function()
  {
    if ((this._getOption("readOnly") === false) || 
        (this.options.props.diffkind == 'merge'))
    {
      var ed;
      if (this.options.props.diffkind !== null)
      { 
        if (this.aceDiff.copyStackInd > 0) 
        {
          this.aceDiff.copyStackInd--;
          if (this.aceDiff.copyStack[this.aceDiff.copyStackInd])
          {
            if (this.aceDiff.copyStack[this.aceDiff.copyStackInd] === "toLeft")
              ed = this.diffeds.left;
            else if (this.aceDiff.copyStack[this.aceDiff.copyStackInd] === "toRight")
              ed = this.diffeds.right;
          }
        }
        else
          return;
      }
      else
        ed = this.eds[0];

      if(ed.session.getUndoManager().hasRedo())
        ed.session.getUndoManager().redo();
      ed.focus();
    }
  },

  /** Change case of selection. 
      @param {string} toWhich - "toUpper" or "toLower"
  */
  caseChange:function(toWhich) 
  {
    if ((this.options.props.diffkind !== null) || (this._getOption("readOnly") === true))
      return;

    if (!this.caseChangeTypes.includes(toWhich)) 
    {
      console.error("case change type '" + toWhich + "' is not valid.");
      return;
    }

    if (toWhich === "toUpper")
      this._ace_editor.toUpperCase();
    else
      this._ace_editor.toLowerCase();
    this._ace_editor.focus();
  },

  /** Add/remove comments on selection or word under cursor */
  commentToggle:function()
  {
    if ((this.options.props.diffkind !== null) || (this._getOption("readOnly") === true))
      return;

    this._ace_editor.toggleCommentLines();
    this._ace_editor.focus();
  },


  /** When multiselections are active, toggleFoldSelections() toggles between 
      folding all selections down to just the first line of each selection, 
      and unfolding all selections.
  */
  toggleFoldSelections:function()
  {
    if (this.options.props.diffkind !== null)
      return;

    var ed_sess = this._ace_editor.session;
    var i;
    var nrange, prevrange;
    var Range = ace.require('ace/range').Range;
    var fold;
    var edobj = this;

    var addFiltFold = function(title, range) {
      ed_sess.addFold(title, range);  
      var nfold = ed_sess.getFoldAt(range.start.row, 
                                   range.start.column, 1);
      edobj.findFilterFolds.push(nfold);
    }

    if (this.findFilterFolds.length)
    {
      // button clicked 2nd time: remove all temp find folds
      this.findFilterFolds.forEach( function(item) {
         fold = ed_sess.getFoldAt(item.start.row, item.start.column, 1);
         if (fold)
           ed_sess.removeFold(fold);
      });
      this.findFilterFolds = [];
      return;
    }

    var allranges = ed_sess.selection.getAllRanges();
    if (allranges && 
        (allranges[0].start.row == allranges[0].end.row) &&
        (allranges[0].start.column == allranges[0].end.column))
      return;  // find results are already un-highlighted.

    for (i = 0; i < allranges.length; i++)
    {
      nrange = new Range(allranges[i].start.row, 
                         allranges[i].start.column, 
                         allranges[i].start.row, 
                         allranges[i].start.column + 1); 
      nrange.start.column = ed_sess.getLine(nrange.start.row).length;
      if (typeof prevrange === "undefined")
      {
        // First hit. If not on the 1st line, fold up lines up to the first hit.
        if (nrange.start.row > 0)
        {
          var firstrange = new Range (
                        0, 0, 
                        nrange.start.row -1,
                        ed_sess.getLine(nrange.start.row -1).length);
          addFiltFold(".........", firstrange)
        }
      }
      else
      {
        if (nrange.start.row > prevrange.start.row + 1)
        {
          prevrange.end.row = nrange.start.row - 1;
          prevrange.end.column = ed_sess.getLine(nrange.end.row -1).length;
          addFiltFold("...", prevrange);
        }
      }
      prevrange = nrange; 
    }
    if (typeof nrange !== "undefined")
    {
      // Add folding button for last search hit
      var totlines = ed_sess.doc.getAllLines();
      nrange.end.row = totlines.length;
      nrange.end.column = ed_sess.getLine(nrange.end.row).length;
      addFiltFold("...", nrange);
    }
  },


  /** Insert text at cursor
      @param {string} text - text to insert
  */
  insertAtCursor : function(text, whichEd)
  {
    if ((text === undefined) || (typeof text !== 'string'))
      return;

    if ((this.options.props.tstampDiv !== null) || (this.options.props.diffkind !== null))
      return;

    if (whichEd === undefined)
      whichEd = "default";

    var ed = this.getEditor(whichEd);

    ed.session.insert(this.cursorPos(whichEd), text);
  },

  /** Pop up native ACE search box
  */
  searchBox : function()
  {
    if (this.options.props.diffkind === null)
    {
      this._ace_editor.execCommand("find");
      var existCondition = setInterval(function() {
        if ($(this.element[0]).find("input.ace_search_field").length) {
          clearInterval(existCondition);
          if (this.fbox === undefined)
          {
            this.fbox = $(this.element[0]).find("input.ace_search_field");
            this.fbox.on("input", function(e) {  
              if (e.target.value.length > 100000)  
              {
                // js regex methods throw exceptions when passed very long patterns.
                e.target.value = '??????????';                
                console.warn("Search pattern is too long.");
              }
            });
          }
          // prevent ibx from ignoring backspace and space
          this.fbox.attr("type", "search"); 
        }
      }.bind(this), 100); // check every 100ms
    }
  },

  /** Select all text in session buffer
  */
  selectAll : function()
  {
    if (this.options.props.diffkind === null)
    {
      this.eds[0].selectAll();
      this.eds[0].focus();
    }
  },


  /** Unfold (expand) all folded sections
  */
  unfoldAll : function()
  {
    if (this.options.props.diffkind === null)
    {
      // if there is tstamp col, its folds will react to the main 
      // session unfolds
      this.eds[0].session.unfold();  
    }
  },

  /** Set/Get cursor position
      @param {editSessionType} whichEd - editor session
      @param {object} pos - position object (row & column) for setting; unused for getting
      @returns {object} position object (row & column) if getting, or undefined if setting.
  */
  cursorPos : function(whichEd, pos)
  {
    if (whichEd === undefined)
      return;

    var ed = this.getEditor(whichEd);

    if (pos !== undefined)  // Set
    {
      this._refresh();
      ed.scrollToLine(pos.row, true, true, function () {});
      ed.gotoLine(pos.row + 1, pos.column, true);
    }
    else  // Get
    {
      return (ed.getCursorPosition());
    }
  },


  // Scroll to bottom of session and bring last line into view
  //    param {object} whichEd - editor object
  //
  _scrollToBottom : function(whichEd)
  {
    if (this.options.props.diffkind === null)
    {
      var ed = whichEd ? whichEd : this.eds[0];
      var edobj = this;
      // unlike this.cursorPos(), this._scrollToBottom() does not 
      // require a pos object.
      edobj._refresh();
      var len = ed.getSession().getLength();
      ed.scrollToLine(len ? len : 1, true, true, function () {});
      ed.gotoLine(len ? len : 1, 0, true);
    }
  },

  // Create timestamp session in parallel to log body session
  //    @access private
  //    @param {Object} ace_tstamp_id - id of the ace timestamp div
  //
  _timeStampColumn : function(ace_tstamp_id, props)
  {
    this._ace_tstamp_id = ace_tstamp_id;
    this._ace_tstamp = ace.edit(ace_tstamp_id);
    this.eds.push(this._ace_tstamp);
    this.contentAny("tstamp", this.options.props.tstampContent);
    this._ace_tstamp.setOption("showGutter", false);

    $(this._ace_tstamp_div).addClass("wf-ace-text-editor");
    if (props.topBorder === true)
      $(this._ace_tstamp_div).addClass("wf-ace-top-border"); 

    this.tstamp_scroll_div = 
      $("#" + this._ace_tstamp_id).find('.ace_scrollbar-v');

    this.scroll_div = 
      $("#" + this.element[0].id).find('.ace_scrollbar-v');

    this._ace_tstamp.scrollCalled = false;
    this._ace_editor.scrollCalled = false;

    this._ace_tstamp.renderer.on('afterRender', function() {
        var log_scroller = $(this.element).find(".ace_scroller");
        this._ace_tstamp.container.style.height = 
                                     log_scroller[0].clientHeight + "px";
        this._scrollToBottom(this._ace_tstamp);
        this._ace_tstamp.renderer.removeAllListeners('afterRender');
    }.bind(this));

    var edobj = this;
    // sync tstamp / log scrollbars   
    if (this.scroll_div.length)
    {
      this.tstamp_scroll_div.on('scroll', function () {
         if (!edobj._ace_tstamp.scrollCalled) {
           edobj._ace_editor.scrollCalled = true;
           edobj.scroll_div.scrollTop($(this).scrollTop());
         }
         edobj._ace_tstamp.scrollCalled = false;
      });

      this.scroll_div.on('scroll', function () {
        if (!edobj._ace_editor.scrollCalled) {
          edobj._ace_tstamp.scrollCalled = true;
          edobj.tstamp_scroll_div.scrollTop($(this).scrollTop());
        }
       edobj._ace_editor.scrollCalled = false;
      });
    }

    var Range = ace.require('ace/range').Range;

    // sync log body session's fold action with tstamp session
    this._ace_editor.session.on("changeFold", function(e, session) {
       var fold = e.data;
       var ed_sess = this._ace_tstamp.session;
       var frange = new Range (fold.start.row, 0, fold.end.row,
                              ed_sess.getLine(fold.end.row).length);
       if (e.action === "add")
         ed_sess.addFold(".........", frange);  
       else // action === "remove"
       {
         var rfold = ed_sess.getFoldAt(fold.start.row, 0, 1);
         if (rfold)
           ed_sess.removeFold(rfold);  
       }
       this._syncTstampHeight();
    }.bind(this));

    // sync tstamp session fold action with log body session
    this._ace_tstamp.session.on("changeFold", function(e, session) {
       var fold = e.data;
       var ed_sess = this._ace_editor.session;

       // Clicks in the tstamp session can only unfold an already
       // created fold.
       if (e.action === "remove")
       {
         var rfold = ( ed_sess.getFoldAt(fold.start.row, 0, 1) ||
                       ed_sess.getFoldAt(fold.start.row, 
                              ed_sess.getLine(fold.start.row).length, 1));
         if (rfold)
           ed_sess.removeFold(rfold);  
       }
    }.bind(this));

    this._syncTstampHeight();

    $(this._ace_tstamp_div).css("visibility", "visible");

    this._event508bind([this._ace_tstamp]);
  },

  /** Returns true if file, based on its mode, can have comments 
  */
  canHaveComments: function() 
  {
    var mode = this._getOption("mode");
    var simpleMode = mode.slice(mode.lastIndexOf('/') + 1);
    return (this.fTypesHaveComments.includes(simpleMode));
  },


  /** Returns true if file, based on its mode, can have custom folding
  */
  canHaveCustomFolding: function() 
  {
    return ((this._getOption("mode") === "ace/mode/focexec") && 
            (this.options.props.diffkind === null));
  },

  /** Returns true if file, based on its mode, can have folding widgets
  */
  canHaveFoldWidgets: function() 
  {
    var mode = this._getOption("mode");
    return ((mode !== "ace/mode/text") && (mode !== "") &&
            (this.options.props.diffkind === null));
  },




	
	

	
	
	

    // The methods below assume one edit instance per session (no timestamp columns, no diff left/right)
  
  _onEditorAreaChangeCursorEvent:function (e)
  {  
    this.setCursorPositionInfo(e);
  },
  
  _onKeyDown:function(e) 
  {        
    var charCode = e.which || e.keyCode;
            
    if(charCode==45)
    {
      if(this._insertKeyStatus)
      {
        this._insertKeyStatus = false;
      }
      else
      {
        this._insertKeyStatus = true;
      }
      
      this.setInsertStatusLabel();
    }
    else if(charCode >= 96 && charCode <= 105) // Numbers on keypad with NumLock ON
    {
      var data = {"numlockKeyStatus":ibx.resourceMgr.getString("bid_numlock_on")};    
      this.element.trigger("SET_STATUS_BAR_NUM_KEY_METADATA", data);
    }
    else if( (charCode >= 33 && charCode <= 40) || charCode == 12) // Numbers on keypad with NumLock OFF
    {
      var data = {"numlockKeyStatus":ibx.resourceMgr.getString("bid_numlock_off")};    
      this.element.trigger("SET_STATUS_BAR_NUM_KEY_METADATA", data);
    }
  },
  
  _onKeyPress:function(e) 
  {        
    var charCode = e.which || e.keyCode;      
    var shifton = e.shiftKey;

      if ( (charCode >= 97 && charCode <= 122 && shifton) || (charCode >= 65 && charCode <= 90 && !shifton) )
      {
        var data = {"capslockKeyStatus":ibx.resourceMgr.getString("bid_capslock_on")};    
      this.element.trigger("SET_STATUS_BAR_CAPS_KEY_METADATA", data);
      }      
      else if ( (charCode >= 97 && charCode <= 122 && !shifton) || (charCode >= 65 && charCode <= 90 && shifton) )
      {
        var data = {"capslockKeyStatus":ibx.resourceMgr.getString("bid_capslock_off")};    
      this.element.trigger("SET_STATUS_BAR_CAPS_KEY_METADATA", data);
      }    
  },
  
  
  onUndoManagerChange:function(e) 
  {
    var that = this;
    
    if(that._ace_editor)
    {
      setTimeout(function()
      { 
        if(that._ace_editor)
        {
          var bClean = that._ace_editor.getSession().getUndoManager().isClean(); // delay due to this call
          var bUndo = that._ace_editor.getSession().getUndoManager().hasUndo();
          var bRedo = that._ace_editor.getSession().getUndoManager().hasRedo();
    
          var data = {"_isClean":bClean, '_isUndo':bUndo, '_isRedo':bRedo};    
          this.element.trigger("EDITOR_UNDO_MANAGER_CHANGE_EVENT", data);
        }
       }.bind(this), 500);
    }
  },
  
  isClean:function()
  { 
    return this._ace_editor.getSession().getUndoManager().isClean();
  },
  
  setClean:function()
  {
    this._ace_editor.getSession().getUndoManager().markClean();
    this.onUndoManagerChange();
  },
  
  resetUndoManager:function()
  {
    this._ace_editor.getSession().getUndoManager().reset();
    this.onUndoManagerChange();
  },
  
  selectionToUpperCase:function(e)
  {
    this.caseChange("toUpper");
  },
  
  selectionToLowerCase:function(e)
  {
    this.caseChange("toLower");
  },

  editorComment:function(e)
  {
    this.commentToggle();
  },
  
  editorCommentBlock:function(e) // not currently used.
  {
    this._ace_editor.execCommand("toggleBlockComment");
  },
  
  editorRedo:function(e)
  {
    this.redo();
  },
  
  editorUndo:function(e)
  {
    this.undo();
  },
  

  /** Cut text via custom context menu 
  */
  editorCut:function(e)
  {
    if (this._getOption("readOnly") === true)  
      return;
    this.editorCopy(e);  
    // The caller will take care of that	
    //this.deleteSelectedText(e);
    this._ace_editor.focus();
  },
  
  /** Copy text via custom context menu 
  */
  editorCopy:function(e)
  {
    var selection = this._ace_editor.session.getTextRange(this._ace_editor.getSelectionRange());
    if(selection && selection.length > 0)
    {
      var data = {"_editorClipboardData":selection};    
      this.element.trigger("SET_EDITOR_CLIPBOARD_METADATA", data);
    }
    this._ace_editor.focus();
  },
  
  /** Paste text via custom context menu 
  */
  editorPaste:function(editorClipboardData)
  {
    if (this._getOption("readOnly") === true)
      return;
    this._ace_editor.insert(editorClipboardData);
    this._ace_editor.focus();
  },

  setInsertStatusLabel:function()
  {
    var keyStatus = this._insertKeyStatus ? ibx.resourceMgr.getString("bid_insert_on") : ibx.resourceMgr.getString("bid_insert_off");
    var data = {"insertKeyStatus":keyStatus};    
    this.element.trigger("SET_STATUS_BAR_INSERT_KEY_METADATA", data);
  },
  
  setCursorPositionInfo:function(e)
  {    
    var contentLength =  this._ace_editor.session.getValue().length;    
    var lineCount = this._ace_editor.session.getLength();
    var cursor = this._ace_editor.selection.getCursor();    
    var linePosition = cursor.row +1;    
    var columnPosition = cursor.column +1;
    var rangeSelected = false;
    
    var selectedRange = this._ace_editor.selection.getRange();  
    
    if(selectedRange.start.row != selectedRange.end.row || selectedRange.start.column != selectedRange.end.column) //check if range is not empty
    {
      rangeSelected = true;
    }
    //this._editorEnvironment.element.ibxWidget("member", "_lengthLbl").ibxWidget("option", "text", contentLength);
    var data = {"contentLength":contentLength, "lineCount":lineCount,"linePosition":linePosition, "columnPosition":columnPosition, "rangeSelected":rangeSelected};
    this.element.trigger("SET_STATUS_BAR_CURSOR_METADATA", data);
  },
  
  /** 
    Get all current options
  */
  broadcastEditorOptions:function()
  {  
    var data = {"_config" : {}};
    for (var opt in this.options.config)
    {
      data._config[opt] = this._getOption(opt);
    }

    this.element.trigger("EDITOR_OPTIONS_CHANGED_EVENT", data);
  }
});




