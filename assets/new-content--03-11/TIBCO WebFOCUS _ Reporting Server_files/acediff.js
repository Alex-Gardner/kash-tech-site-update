/*------------------------------------------------------------------
* Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.
*
* _Name_        ===> ace/acediff/acediff.js
* _Description_ ===>
*
* _History_:
*  Date  Time Who Proj       Project Title
* ====== ==== === ====== ===========================================
* 190912 1630 dpd 209887 Text editor: Phase 2 epic
* 190801 1445 dpd 214926 Text Editor: diff tool
* 190718 1709 dpd 214926 Text Editor: diff / merge tool
* 190717 1615 dpd 214926 Text Editor: diff / merge tool
* 190715 1754 dpd 214926 Text Editor: diff / merge tool
* 190708 1249 dpd 214926 Text Editor: diff / merge tool
* 190628 1652 dpd 214926 Text Editor: diff / merge tool
* 190628 1636 dpd 214926 Text Editor: diff / merge tool
*
* END %&$
*-------------------------------------------------------------------*/


// aceDiff 2.3.0  (converted from ES6 to ES5)

/* DPD - using self-invoking function wrapper w/ closure */

var AceDiff = (function() {
/** lodash utilities:   **/

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
function lodash_toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (lodash_isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = lodash_isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
};


/**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
function lodash_debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = lodash_toNumber(wait) || 0;
      if (lodash_isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? Math.max(lodash_toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = Date.now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
      }

      function debounced() {
        var time = Date.now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
};


function lodash_isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
};

 /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
function lodash_throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (lodash_isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return lodash_debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
};


/** end of lodash utilities **/

/**
 * Search for element in parent and create it if it can't be found
 * @param {*HTMLElement} parent
 * @param {string} elClass Element class
 *
 * Returns ID of the element
 */
function aceDiff_ensureElement(parent, elClass) {
  var guid = Math.random().toString(36).substr(2, 5);
 //var newId = `js-${elClass}-${guid}`;
  var newId = "js-" + elClass + "-" + guid;

  //var currentEl = parent.querySelector(`.${elClass}`);
  var currentEl = parent.querySelector("." + elClass);
  if (currentEl) {
    currentEl.id = currentEl.id || newId;
    return currentEl.id;
  }

  var el = document.createElement('div');
  parent.appendChild(el);
  el.className = elClass;
  el.id = newId;
  return el.id;
}


function aceDiff_query_on(elSelector, eventName, selector, fn) {
  var element = (elSelector === 'document') ? document : document.querySelector(elSelector);

  element.addEventListener(eventName, function(event) {
    var possibleTargets = element.querySelectorAll(selector);
    var target = event.target;

    for (var i = 0, l = possibleTargets.length; i < l; i += 1) {
      var el = target;
      var p = possibleTargets[i];

      while (el && el !== element) {
        if (el === p) {
          fn.call(p, event);
        }
        el = el.parentNode;
      }
    }
    });
};



function aceDiff_normalizeContent(value) {
  var normalized = value.replace(/\r\n/g, '\n');
  return normalized;
}


// generates a Bezier curve in SVG format
function aceDiff_getCurve(startX, startY, endX, endY) {
  var w = endX - startX;
  var halfWidth = startX + (w / 2);

  // now create the curve
  // position it at the initial x,y coords
  // This is of the form "C M,N O,P Q,R" where C is a directive for SVG ("curveto"),
  // M,N are the first curve control point, O,P the second control point
  // and Q,R are the final coords

  //return `M ${startX} ${startY} C ${halfWidth},${startY} ${halfWidth},${endY} ${endX},${endY}`;
  return "M " + startX + " " + startY + " C " + halfWidth + "," + startY + " " + halfWidth + "," + endY + " " + endX + "," + endY;
}



var aceDiff_requireFunc = (ace.require);

var aceDiff_Range = aceDiff_requireFunc('ace/range').Range;



// our constructor
var AceDiff_create = function(options) {

  this.options = options;

  // IE 11 cannot handle .startsWith 
  if (!String.prototype.startsWith) {
     String.prototype.startsWith = function(searchString, position){
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
  }

  if (this.options.element === null) {
    console.error('You need to specify an element for Ace-diff');
    return;
  }

  if (this.options.element instanceof HTMLElement) {
    this.el = this.options.element;
  } else {
    this.el = document.body.querySelector(this.options.element);
  }

  if (!this.el) {
    console.error("Can't find the specified element " + this.options.element);
    return;
  }

  this.options.left.id = aceDiff_ensureElement(this.el, 'acediff__left');
  this.options.classes.gutterID = aceDiff_ensureElement(this.el, 'acediff__gutter');
  this.options.right.id = aceDiff_ensureElement(this.el, 'acediff__right');

  //this.el.innerHTML = `<div class="acediff__wrap">${this.el.innerHTML}</div>`;
  this.el.innerHTML = '<div class="acediff__wrap">' + this.el.innerHTML + '</div>';

  // instantiate the editors in an internal data structure
  // that will store a little info about the diffs and
  // editor content
  this.editors = {
    left: {
      ace: ace.edit(this.options.left.id),
      markers: [],
      lineLengths: [],
    },
    right: {
      ace: ace.edit(this.options.right.id),
      markers: [],
      lineLengths: [],
    },
    editorHeight: null,
  };

  this.C = {
    DIFF_EQUAL: 0,
    DIFF_DELETE: -1,
    DIFF_INSERT: 1,
    EDITOR_RIGHT: 'right',
    EDITOR_LEFT: 'left',
    RTL: 'rtl',
    LTR: 'ltr',
    SVG_NS: 'http://www.w3.org/2000/svg',
    DIFF_GRANULARITY_SPECIFIC: 'specific',
    DIFF_GRANULARITY_BROAD: 'broad',
  };

  var C = this.C;

  function getMode(acediff, editor) {
    var mode = acediff.options.mode;
    if (editor === acediff.C.EDITOR_LEFT && acediff.options.left.mode !== null) {
      mode = acediff.options.left.mode;
    }
    if (editor === acediff.C.EDITOR_RIGHT && acediff.options.right.mode !== null) {
      mode = acediff.options.right.mode;
    }
    return mode;
  }


  function getTheme(acediff, editor) {
    var theme = acediff.options.theme;
    if (editor ===  acediff.C.EDITOR_LEFT && acediff.options.left.theme !== null) {
      theme = acediff.options.left.theme;
    }
    if (editor ===  acediff.C.EDITOR_RIGHT && acediff.options.right.theme !== null) {
      theme = acediff.options.right.theme;
    }
    return theme;
  }


  // set up the editors
  this.editors.left.ace.getSession().setMode(getMode(this, C.EDITOR_LEFT));
  this.editors.right.ace.getSession().setMode(getMode(this, C.EDITOR_RIGHT));
  this.editors.left.ace.setReadOnly(!this.options.left.editable);
  this.editors.right.ace.setReadOnly(!this.options.right.editable);
  this.editors.left.ace.setTheme(getTheme(this, C.EDITOR_LEFT));
  this.editors.right.ace.setTheme(getTheme(this, C.EDITOR_RIGHT));

  this.editors.left.ace.setValue(aceDiff_normalizeContent(this.options.left.content), -1);
  this.editors.right.ace.setValue(aceDiff_normalizeContent(this.options.right.content), -1);


  function getEditorHeight(acediff) {
    // editorHeight: document.getElementById(acediff.options.left.id).clientHeight
    return document.getElementById(acediff.options.left.id).offsetHeight;
  }

  // store the visible height of the editors (assumed the same)
  this.editors.editorHeight = getEditorHeight(this);

  var aceDiffObj = this;

  function clearDiffs(acediff) {
    acediff.editors.left.markers.forEach(function (marker) {
      this.editors.left.ace.getSession().removeMarker(marker);
    }, acediff);
    acediff.editors.right.markers.forEach(function (marker) {
      this.editors.right.ace.getSession().removeMarker(marker);
    }, acediff);
  }

  // The lineHeight is set to 0 initially and we need to wait for another tick to get it
  // Thus moving the diff() with it
  // DPD - sometimes 1 tick is not enough. Changed setTimeout to setInterval
  var existConditionLH = setInterval(function() {
    // assumption: both editors have same line heights
    if (aceDiffObj.editors.left.ace.renderer.lineHeight > 0)
    {
      clearInterval(existConditionLH);
      aceDiffObj.lineHeight = aceDiffObj.editors.left.ace.renderer.lineHeight;

      // called onscroll. Updates the gap to ensure the connectors are all lining up
      function updateGap(acediff, editor, scroll) {
        clearDiffs(acediff);
        aceDiff_decorate(acediff);

        function positionCopyContainers(acediff) {
          var leftTopOffset = acediff.editors.left.ace.getSession().getScrollTop();
           var rightTopOffset = acediff.editors.right.ace.getSession().getScrollTop();


          acediff.copyRightContainer.style.cssText = "top: " + (-leftTopOffset) + "px";
          acediff.copyLeftContainer.style.cssText = "top: " + (-rightTopOffset) + "px";
        }

        // reposition the copy containers containing all the arrows
        positionCopyContainers(acediff);
      }
    
      function addEventHandlers(acediff) {
        acediff.editors.left.ace.getSession().on('changeScrollTop', 
             lodash_throttle( function(scroll) { updateGap(acediff, 'left', scroll); }, 16));
        acediff.editors.right.ace.getSession().on('changeScrollTop', 
             lodash_throttle(function(scroll) { updateGap(acediff, 'right', scroll); }, 16));
      
        var diff = acediff.diff.bind(acediff);
        acediff.editors.left.ace.on('change', diff);
        acediff.editors.right.ace.on('change', diff);
      
        if (acediff.options.left.copyLinkEnabled) {
          aceDiff_query_on("#" + acediff.options.classes.gutterID, 'click', "." + acediff.options.classes.newCodeConnectorLink, function(e) {
            aceDiff_copy(acediff, e, C.LTR);
          });
        };
        if (acediff.options.right.copyLinkEnabled) {
          aceDiff_query_on("#" + acediff.options.classes.gutterID, 'click', "." + acediff.options.classes.deletedCodeConnectorLink, function(e) {
            aceDiff_copy(acediff, e, C.RTL);
          });
        }
      
        var onResize = lodash_debounce(function() {
          acediff.editors.availableHeight = document.getElementById(acediff.options.left.id).offsetHeight;
      
          // TODO this should re-init gutter
          acediff.diff();
        }, 250);
      
        // DPD - vertical resizing event for all editor sessions is 
        // handled in wce.js
        //window.addEventListener('resize', onResize);
        removeEventHandlers = function() {
          window.removeEventListener('resize', onResize);
        };
      }
    
      // creates two contains for positioning the copy left + copy right arrows
      function createCopyContainers(acediff) {
        acediff.copyRightContainer = document.createElement('div');
        acediff.copyRightContainer.setAttribute('class', acediff.options.classes.copyRightContainer);
        acediff.copyLeftContainer = document.createElement('div');
        acediff.copyLeftContainer.setAttribute('class', acediff.options.classes.copyLeftContainer);
    
        document.getElementById(acediff.options.classes.gutterID).appendChild(acediff.copyRightContainer);
        document.getElementById(acediff.options.classes.gutterID).appendChild(acediff.copyLeftContainer);
      }

      addEventHandlers(aceDiffObj);
      createCopyContainers(aceDiffObj);
      // DPD - gutter's clientHeight is initially 0 and width is initially set to
      // the width of the editor, so we need to wait for the correct dimensions; 
      // otherwise, the gutter connector curves will appear as straight lines.
      var existConditionGW = setInterval(function() {
        var gutwidth = document.getElementById(aceDiffObj.options.classes.gutterID).clientWidth;
        var gutheight = document.getElementById(aceDiffObj.options.classes.gutterID).clientHeight;
       // [SRVWKSPC-705] - Wait for a non-zero gutter width that's also < ed width
        if ((gutwidth > 0) && (gutwidth < aceDiffObj.el.clientWidth) && (gutheight > 0))
        {
          clearInterval(existConditionGW);
          aceDiff_createGutter(aceDiffObj);
          aceDiffObj.diff();
        }
      }, 10);

    }
  }, 1);


  // allows on-the-fly changes to the AceDiff instance settings
  this.setOptions = function(options) {
    this.options = options;
    //merge(this.options, options);
    this.diff();
  };

  this.getNumDiffs = function() {
    return this.diffs.length;
  };

  // exposes the Ace editors in case the dev needs it
  this.getEditors = function() {
    return {
      left: this.editors.left.ace,
      right: this.editors.right.ace,
    };
  };

  // our main diffing function. I actually don't think this needs to exposed: it's called automatically,
  // but just to be safe, it's included
  this.diff = function() {
    var dmp = new DiffMatchPatch.dmp();
    var val1 = this.editors.left.ace.getSession().getValue();
    var val2 = this.editors.right.ace.getSession().getValue();

    //var diff = dmp.diff_main(val2, val1);
    // DPD - line mode diffs give raw data that is closer to what is needed
    var cnv = dmp.diff_linesToChars_(val1, val2);
    var lineText1 = cnv.chars1;
    var lineText2 = cnv.chars2;
    var lineArray = cnv.lineArray;
    var ldiff = dmp.diff_main(lineText1, lineText2, false);
    dmp.diff_charsToLines_(ldiff, lineArray);
    diff = ldiff;

    //dmp.diff_cleanupSemantic(diff);

    // only needed for chunk -> diffobj logic
    function getLineLengths(editor) {
      var lines = editor.ace.getSession().doc.getAllLines();
      var lineLengths = [];
      lines.forEach(function(line) {
        lineLengths.push(line.length + 1); // +1 for the newline char
      });
      return lineLengths;
    }

    this.editors.left.lineLengths = getLineLengths(this.editors.left);
    this.editors.right.lineLengths = getLineLengths(this.editors.right);

    // parse the raw diff into something a little more palatable
    var diffs = [];
    var offset = {
      left: 0,
      right: 0,
    };

    var offsetLn = {
      left: 0,
      right: 0,
    };

    var newln_list = [];

    diff.forEach(function (chunk, index, array) {
      var chunkType = chunk[0];
      var text = chunk[1];

/*
      // Fix for #28 https://github.com/ace-diff/ace-diff/issues/28
      if (array[index + 1] && text.endsWith('\n') && array[index + 1][1].startsWith('\n')) {
        text += '\n';
        diff[index][1] = text;
        diff[index + 1][1] = diff[index + 1][1].replace(/^\n/, '');
      }
*/

      // oddly, occasionally the algorithm returns a diff with no changes made
      if (text.length === 0) {
        return;
      }

      /* DPD - newline count (in each raw line-based diff) is used to build 
               diff objects and advance line nums for next diff object      */
      newln_list = [];
      for(var i=0; i<text.length;i++) {
        if (text[i] === "\n") newln_list.push(i);
      }

      if (chunkType === C.DIFF_EQUAL) {
        offsetLn.left  += newln_list.length;
        offsetLn.right += newln_list.length;
      } else if (chunkType === C.DIFF_DELETE) {
        diffs.push(aceDiff_computelDiff(this, C.DIFF_DELETE, offsetLn.left, offsetLn.right, text, newln_list.length));
        offsetLn.left += newln_list.length;
      } else if (chunkType === C.DIFF_INSERT) {
        diffs.push(aceDiff_computelDiff(this, C.DIFF_INSERT, offsetLn.left, offsetLn.right, text, newln_list.length));
        offsetLn.right  += newln_list.length;
      }

/*  chunk -> diffobj logic. Not used with raw diff line data
      if (chunkType === C.DIFF_EQUAL) {
        offset.left += text.length;
        offset.right += text.length;
      } else if (chunkType === C.DIFF_DELETE) {
        diffs.push(aceDiff_computeDiff(this, C.DIFF_DELETE, offset.left, offset.right, text));
        offset.right += text.length;
      } else if (chunkType === C.DIFF_INSERT) {
        diffs.push(aceDiff_computeDiff(this, C.DIFF_INSERT, offset.left, offset.right, text));
        offset.left += text.length;
      }
*/
    }, this);

    // simplify our computed diffs; this groups together multiple diffs on subsequent lines
    this.diffs = aceDiff_simplifyDiffs(this, diffs);

    // if we're dealing with too many diffs, fail silently
    if (this.diffs.length > this.options.maxDiffs) {
      return;
    }

    clearDiffs(this);
    aceDiff_decorate(this);
  };


  this.destroy = function() {
    var removeEventHandlers = function() {};
    // destroy the two editors
    var leftValue = this.editors.left.ace.getValue();
    this.editors.left.ace.destroy();
    var oldDiv = this.editors.left.ace.container;
    var newDiv = oldDiv.cloneNode(false);
    newDiv.textContent = leftValue;
    oldDiv.parentNode.replaceChild(newDiv, oldDiv);

    var rightValue = this.editors.right.ace.getValue();
    this.editors.right.ace.destroy();
    oldDiv = this.editors.right.ace.container;
    newDiv = oldDiv.cloneNode(false);
    newDiv.textContent = rightValue;
    oldDiv.parentNode.replaceChild(newDiv, oldDiv);

    document.getElementById(this.options.classes.gutterID).innerHTML = '';
    removeEventHandlers();
  }
}



function aceDiff_copy(acediff, e, dir) {
  var diffIndex = parseInt(e.target.getAttribute('data-diff-index'), 10);
  var diff = acediff.diffs[diffIndex];
  var sourceEditor;
  var targetEditor;

  var startLine;
  var endLine;
  var targetStartLine;
  var targetEndLine;
  if (dir ===  acediff.C.LTR) {
    sourceEditor = acediff.editors.left;
    targetEditor = acediff.editors.right;
    startLine = diff.leftStartLine;
    endLine = diff.leftEndLine;
    targetStartLine = diff.rightStartLine;
    targetEndLine = diff.rightEndLine;
    // DPD - copyStack is used by Undo / Redo to keep track of left/right copies
    for (var ind = 0; ind < acediff.copyStackInd; ind ++)
      acediff.copyStack.shift();
    acediff.copyStack.unshift("toRight");
    acediff.copyStackInd = 0;
  } else {
    sourceEditor = acediff.editors.right;
    targetEditor = acediff.editors.left;
    startLine = diff.rightStartLine;
    endLine = diff.rightEndLine;
    targetStartLine = diff.leftStartLine;
    targetEndLine = diff.leftEndLine;
    for (var ind = 0; ind < acediff.copyStackInd; ind ++) 
      acediff.copyStack.shift();
    acediff.copyStack.unshift("toLeft");
    acediff.copyStackInd = 0;
  }

  var contentToInsert = '';
  for (var i = startLine; i < endLine; i += 1) {
    contentToInsert += aceDiff_getLine(sourceEditor, i) + "\n";
  }

  // keep track of the scroll height
  var h = targetEditor.ace.getSession().getScrollTop();
  targetEditor.ace.getSession().replace(new aceDiff_Range(targetStartLine, 0, targetEndLine, 0), contentToInsert);
  targetEditor.ace.getSession().setScrollTop(parseInt(h, 10));

  acediff.diff();
}



// shows a diff in one of the two editors.
function aceDiff_showDiff(acediff, editor, startLine, endLine, className) {
  var editor = acediff.editors[editor];

  if (endLine < startLine) { // can this occur? Just in case.
    endLine = startLine;
  }

  var classNames = "";
  classNames = className + " " + ((endLine > startLine) ? 'lines' : 'targetOnly');
  //const classNames = `${className} ${(endLine > startLine) ? 'lines' : 'targetOnly'}`;
  endLine--; // because endLine is always + 1

  // to get Ace to highlight the full row we just set the start and end chars to 0 and 1
  editor.markers.push(editor.ace.session.addMarker(new aceDiff_Range(startLine, 0, endLine, 1), classNames, 'fullLine'));
}


function aceDiff_addConnector(acediff, leftStartLine, leftEndLine, rightStartLine, rightEndLine) {
  var leftScrollTop = acediff.editors.left.ace.getSession().getScrollTop();
  var rightScrollTop = acediff.editors.right.ace.getSession().getScrollTop();

  // All connectors, regardless of ltr or rtl have the same point system, even if p1 === p3 or p2 === p4
  //  p1   p2
  //
  //  p3   p4

  acediff.connectorYOffset = 1;

  var p1_x = -1;
  var p1_y = (leftStartLine * acediff.lineHeight) - leftScrollTop + 0.5;
  var p2_x = acediff.gutterWidth + 1;
  var p2_y = rightStartLine * acediff.lineHeight - rightScrollTop + 0.5;
  var p3_x = -1;
  var p3_y = (leftEndLine * acediff.lineHeight) - leftScrollTop + acediff.connectorYOffset + 0.5;
  var p4_x = acediff.gutterWidth + 1;
  var p4_y = (rightEndLine * acediff.lineHeight) - rightScrollTop + acediff.connectorYOffset + 0.5;
  var curve1 = aceDiff_getCurve(p1_x, p1_y, p2_x, p2_y);
  var curve2 = aceDiff_getCurve(p4_x, p4_y, p3_x, p3_y);

  var verticalLine1 = "L" + p2_x + "," + p2_y + " " + p4_x + "," + p4_y;
  var verticalLine2 = "L" + p3_x + "," + p3_y + " " + p1_x + "," + p1_y;
  var d = curve1 + " " + verticalLine1 + " " + curve2 + " " + verticalLine2;

  var el = document.createElementNS( acediff.C.SVG_NS, 'path');
  el.setAttribute('d', d);
  el.setAttribute('class', acediff.options.classes.connector);
  acediff.gutterSVG.appendChild(el);
}


function aceDiff_addCopyArrows(acediff, info, diff_index) {
  function createArrow(info) {
    var el = document.createElement('div');
    var props = {
      class: info.className,
      style:  "top:" + info.topOffset + "px",
      title: info.tooltip,
      'data-diff-index': info.diffIndex,
    };
    for (var key in props) {
      el.setAttribute(key, props[key]);
    }
    el.innerHTML = info.arrowContent;
    return el;
  }


  if (info.leftEndLine > info.leftStartLine && acediff.options.left.copyLinkEnabled) {
    var arrow = createArrow({
      className: acediff.options.classes.newCodeConnectorLink,
      topOffset: info.leftStartLine * acediff.lineHeight,
      tooltip: acediff.copyRightStr,
      diffIndex : diff_index,
      arrowContent: acediff.options.classes.newCodeConnectorLinkContent,
    });
    acediff.copyRightContainer.appendChild(arrow);
  }

  if (info.rightEndLine > info.rightStartLine && acediff.options.right.copyLinkEnabled) {
    var arrow = createArrow({
      className: acediff.options.classes.deletedCodeConnectorLink,
      topOffset: info.rightStartLine * acediff.lineHeight,
      tooltip: acediff.copyLeftStr,
      diffIndex : diff_index,
      arrowContent: acediff.options.classes.deletedCodeConnectorLinkContent,
    });
    acediff.copyLeftContainer.appendChild(arrow);
  }
}


/* 
 *  aceDiff_computelDiff
 *       creates a diff object from the raw line diff data. Object is in the 
 *       acediff form:
 *
 * {
 *   leftStartLine:
 *   leftEndLine:
 *   rightStartLine:
 *   rightEndLine:
 * }
      DPD - This function replaces aceDiff_computeDiff(), because the latter 
            loses some diffing data. This function uses raw line diff data
            instead of raw diff chunk data.
 */
function aceDiff_computelDiff(acediff, diffType, offsetLnLeft, offsetLnRight, diffText, newln_cnt) {
 var lineInfo = {};
 
  if (diffType === acediff.C.DIFF_INSERT) 
  {
    lineInfo = {
      leftStartLine : offsetLnLeft,
      leftEndLine: offsetLnLeft,
      rightStartLine: offsetLnRight,
      rightEndLine: offsetLnRight + newln_cnt
    }
  }
  else
  {
    lineInfo = {
      leftStartLine : offsetLnLeft,
      leftEndLine: offsetLnLeft + newln_cnt,
      rightStartLine: offsetLnRight,
      rightEndLine: offsetLnRight
    }
  }

 return lineInfo;
}

/**
 * This method takes the raw diffing info from the Google lib and returns a nice clean object of the following
 * form:
 * {
 *   leftStartLine:
 *   leftEndLine:
 *   rightStartLine:
 *   rightEndLine:
 * }
 *
 * Ultimately, that's all the info we need to highlight the appropriate lines in the left + right editor, add the
 * SVG connectors, and include the appropriate <<, >> arrows.
 *
 * Note: leftEndLine and rightEndLine are always the start of the NEXT line, so for a single line diff, there will
 * be 1 separating the startLine and endLine values. So if leftStartLine === leftEndLine or rightStartLine ===
 * rightEndLine, it means that new content from the other editor is being inserted and a single 1px line will be
 * drawn.
 */
function aceDiff_computeDiff(acediff, diffType, offsetLeft, offsetRight, diffText) {
  var lineInfo = {};

  // this was added in to hack around an oddity with the Google lib. Sometimes it would include a newline
  // as the first char for a diff, other times not - and it would change when you were typing on-the-fly. This
  // is used to level things out so the diffs don't appear to shift around
  var newContentStartsWithNewline = /^\n/.test(diffText);

  if (diffType === acediff.C.DIFF_INSERT) {
    // pretty confident this returns the right stuff for the left editor: start & end line & char
    var info = aceDiff_getSingleDiffInfo(acediff.editors.left, offsetLeft, diffText);

    // this is the ACTUAL undoctored current line in the other editor. It's always right. Doesn't mean it's
    // going to be used as the start line for the diff though.
    var currentLineOtherEditor = aceDiff_getLineForCharPosition(acediff.editors.right, offsetRight);
    var numCharsOnLineOtherEditor = aceDiff_getCharsOnLine(acediff.editors.right, currentLineOtherEditor);
    var numCharsOnLeftEditorStartLine = aceDiff_getCharsOnLine(acediff.editors.left, info.startLine);
    var numCharsOnLine = aceDiff_getCharsOnLine(acediff.editors.left, info.startLine);

    // this is necessary because if a new diff starts on the FIRST char of the left editor, the diff can comes
    // back from google as being on the last char of the previous line so we need to bump it up one
    var right_start_line = currentLineOtherEditor;
    if (numCharsOnLine === 0 && newContentStartsWithNewline) {
      newContentStartsWithNewline = false;
    }
    if (info.startChar === 0 && aceDiff_isLastChar(acediff.editors.right, offsetRight, newContentStartsWithNewline)) {
      right_start_line = currentLineOtherEditor + 1;
    }

    var sameLineInsert = info.startLine === info.endLine;

    // whether or not this diff is a plain INSERT into the other editor, or overwrites a line take a little work to
    // figure out. This feels like the hardest part of the entire script.
    var numRows = 0;
    if (

      // dense, but this accommodates two scenarios:
      // 1. where a completely fresh new line is being inserted in left editor, we want the line on right to stay a 1px line
      // 2. where a new character is inserted at the start of a newline on the left but the line contains other stuff,
      //    we DO want to make it a full line
      (info.startChar > 0 || (sameLineInsert && diffText.length < numCharsOnLeftEditorStartLine)) &&

      // if the right editor line was empty, it's ALWAYS a single line insert [not an OR above?]
      numCharsOnLineOtherEditor > 0 &&

      // if the text being inserted starts mid-line
      (info.startChar < numCharsOnLeftEditorStartLine)) {
      numRows++;
    }

    lineInfo = {
      leftStartLine: info.startLine,
      leftEndLine: info.endLine + 1,
      rightStartLine : right_start_line,
      rightEndLine: right_start_line + numRows,
    };
  } else {
    var info = aceDiff_getSingleDiffInfo(acediff.editors.right, offsetRight, diffText);

    var currentLineOtherEditor = aceDiff_getLineForCharPosition(acediff.editors.left, offsetLeft);
    var numCharsOnLineOtherEditor = aceDiff_getCharsOnLine(acediff.editors.left, currentLineOtherEditor);
    var numCharsOnRightEditorStartLine = aceDiff_getCharsOnLine(acediff.editors.right, info.startLine);
    var numCharsOnLine = aceDiff_getCharsOnLine(acediff.editors.right, info.startLine);

    // this is necessary because if a new diff starts on the FIRST char of the left editor, the diff can comes
    // back from google as being on the last char of the previous line so we need to bump it up one
    var left_start_line = currentLineOtherEditor;
    if (numCharsOnLine === 0 && newContentStartsWithNewline) {
      newContentStartsWithNewline = false;
    }
    if (info.startChar === 0 && aceDiff_isLastChar(acediff.editors.left, offsetLeft, newContentStartsWithNewline)) {
      left_start_line = currentLineOtherEditor + 1;
    }

    var sameLineInsert = info.startLine === info.endLine;
    var numRows = 0;
    if (

      // dense, but this accommodates two scenarios:
      // 1. where a completely fresh new line is being inserted in left editor, we want the line on right to stay a 1px line
      // 2. where a new character is inserted at the start of a newline on the left but the line contains other stuff,
      //    we DO want to make it a full line
      (info.startChar > 0 || (sameLineInsert && diffText.length < numCharsOnRightEditorStartLine)) &&

      // if the right editor line was empty, it's ALWAYS a single line insert [not an OR above?]
      numCharsOnLineOtherEditor > 0 &&

      // if the text being inserted starts mid-line
      (info.startChar < numCharsOnRightEditorStartLine)) {
      numRows++;
    }

    lineInfo = {
      leftStartLine : left_start_line,
      leftEndLine: left_start_line + numRows,
      rightStartLine: info.startLine,
      rightEndLine: info.endLine + 1,
    };
  }

  return lineInfo;
}


// helper to return the startline, endline, startChar and endChar for a diff in a particular editor. Pretty
// fussy function
function aceDiff_getSingleDiffInfo(editor, offset, diffString) {
  var info = {
    startLine: 0,
    startChar: 0,
    endLine: 0,
    endChar: 0,
  };
  var endCharNum = offset + diffString.length;
  var runningTotal = 0;
  var startLineSet = false,
    endLineSet = false;

  editor.lineLengths.forEach( function(lineLength, lineIndex) {
    runningTotal += lineLength;

    if (!startLineSet && offset < runningTotal) {
      info.startLine = lineIndex;
      info.startChar = offset - runningTotal + lineLength;
      startLineSet = true;
    }

    if (!endLineSet && endCharNum <= runningTotal) {
      info.endLine = lineIndex;
      info.endChar = endCharNum - runningTotal + lineLength;
      endLineSet = true;
    }
  });

  // if the start char is the final char on the line, it's a newline & we ignore it
  if (info.startChar > 0 && aceDiff_getCharsOnLine(editor, info.startLine) === info.startChar) {
    info.startLine++;
    info.startChar = 0;
  }

  // if the end char is the first char on the line, we don't want to highlight that extra line
  if (info.endChar === 0) {
    info.endLine--;
  }

  var endsWithNewline = /\n$/.test(diffString);
  if (info.startChar > 0 && endsWithNewline) {
    info.endLine++;
  }

  return info;
}


// note that this and everything else in this script uses 0-indexed row numbers
function aceDiff_getCharsOnLine(editor, line) {
  return aceDiff_getLine(editor, line).length;
}


function aceDiff_getLine(editor, line) {
  return editor.ace.getSession().doc.getLine(line);
}


function aceDiff_getLineForCharPosition(editor, offsetChars) {
  var lines = editor.ace.getSession().doc.getAllLines(),
    foundLine = 0,
    runningTotal = 0;

  for (var i = 0; i < lines.length; i++) {
    runningTotal += lines[i].length + 1; // +1 needed for newline char
    if (offsetChars <= runningTotal) {
      foundLine = i;
      break;
    }
  }
  return foundLine;
}


function aceDiff_isLastChar(editor, char, startsWithNewline) {
  var lines = editor.ace.getSession().doc.getAllLines(),
    runningTotal = 0,
    isLastChar = false;

  for (var i = 0; i < lines.length; i++) {
    runningTotal += lines[i].length + 1; // +1 needed for newline char
    var comparison = runningTotal;
    if (startsWithNewline) {
      comparison--;
    }

    if (char === comparison) {
      isLastChar = true;
      break;
    }
  }
  return isLastChar;
}


function aceDiff_createGutter(acediff) {

  // acediff.editors.left.ace.getSession().getLength() * acediff.lineHeight
  function getTotalHeight(acediff, editor) {
    var ed = (editor === acediff.C.EDITOR_LEFT) ? acediff.editors.left : acediff.editors.right;
    return ed.ace.getSession().getLength() * acediff.lineHeight;
  }

  acediff.gutterHeight = document.getElementById(acediff.options.classes.gutterID).clientHeight;
  acediff.gutterWidth = document.getElementById(acediff.options.classes.gutterID).clientWidth;

  var leftHeight = getTotalHeight(acediff, acediff.C.EDITOR_LEFT);
  var rightHeight = getTotalHeight(acediff, acediff.C.EDITOR_RIGHT);
  var height = Math.max(leftHeight, rightHeight, acediff.gutterHeight);

  acediff.gutterSVG = document.createElementNS(acediff.C.SVG_NS, 'svg');
  acediff.gutterSVG.setAttribute('width', acediff.gutterWidth);
  acediff.gutterSVG.setAttribute('height', height);

  document.getElementById(acediff.options.classes.gutterID).appendChild(acediff.gutterSVG);
}



/*
  * This combines multiple rows where, say, line 1 => line 1, line 2 => line 2, line 3-4 => line 3. That could be
  * reduced to a single connector line 1=4 => line 1-3
  */
function aceDiff_simplifyDiffs(acediff, diffs) {
  var groupedDiffs = [];

  function compare(val) {
    return (acediff.options.diffGranularity === acediff.C.DIFF_GRANULARITY_SPECIFIC) ? val < 1 : val <= 1;
  }

  diffs.forEach(function(diff, index) {
    if (index === 0) {
      groupedDiffs.push(diff);
      return;
    }

    // loop through all grouped diffs. If this new diff lies between an existing one, we'll just add to it, rather
    // than create a new one
    var isGrouped = false;
    for (var i = 0; i < groupedDiffs.length; i++) {
      if (compare(Math.abs(diff.leftStartLine - groupedDiffs[i].leftEndLine)) &&
          compare(Math.abs(diff.rightStartLine - groupedDiffs[i].rightEndLine))) {
        // update the existing grouped diff to expand its horizons to include this new diff start + end lines
        groupedDiffs[i].leftStartLine = Math.min(diff.leftStartLine, groupedDiffs[i].leftStartLine);
        groupedDiffs[i].rightStartLine = Math.min(diff.rightStartLine, groupedDiffs[i].rightStartLine);
        groupedDiffs[i].leftEndLine = Math.max(diff.leftEndLine, groupedDiffs[i].leftEndLine);
        groupedDiffs[i].rightEndLine = Math.max(diff.rightEndLine, groupedDiffs[i].rightEndLine);
        isGrouped = true;
        break;
      }
    }

    if (!isGrouped) {
      groupedDiffs.push(diff);
    }
    });

/*
  // clear out any single line diffs (i.e. single line on both editors)
  var fullDiffs = [];
  groupedDiffs.forEach(function(diff) {
    if (diff.leftStartLine === diff.leftEndLine && diff.rightStartLine === diff.rightEndLine) {
      return;
    }
    fullDiffs.push(diff);
  });
  return fullDiffs;
*/

  return groupedDiffs;
}


function aceDiff_decorate(acediff) {

  function clearArrows(acediff) {
    acediff.copyLeftContainer.innerHTML = '';
    acediff.copyRightContainer.innerHTML = '';
  }

  function clearGutter(acediff) {
    // gutter.innerHTML = '';

    var gutterEl = document.getElementById(acediff.options.classes.gutterID);
    gutterEl.removeChild(acediff.gutterSVG);

    aceDiff_createGutter(acediff);
  }

  clearGutter(acediff);
  clearArrows(acediff);

  acediff.diffs.forEach(function (info, diffIndex) {
    if (this.options.showDiffs) {
      aceDiff_showDiff(this, acediff.C.EDITOR_LEFT, info.leftStartLine, info.leftEndLine, this.options.classes.diff);
      aceDiff_showDiff(this, acediff.C.EDITOR_RIGHT, info.rightStartLine, info.rightEndLine, this.options.classes.diff);

      if (this.options.showConnectors) {
        aceDiff_addConnector(this, info.leftStartLine, info.leftEndLine, info.rightStartLine, info.rightEndLine);
      }
      aceDiff_addCopyArrows(this, info, diffIndex);
    }
  }, acediff);
}

/*
function getScrollingInfo(acediff, dir) {
  return (dir == acediff.C.EDITOR_LEFT) ? acediff.editors.left.ace.getSession().getScrollTop() : acediff.editors.right.ace.getSession().getScrollTop();
}
*/

return { AceDiff : AceDiff_create };

})();
//# sourceURL=ace%acediff%acediff.js
