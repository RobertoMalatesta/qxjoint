/**
 * All nodes must include this mixin!
 */
qx.Class.define("qxjoint.widget.node.BaseNode",
{
  extend : qx.ui.core.Widget,

  include :
  [
    qx.ui.core.MRemoteChildrenHandling,
    qx.ui.core.MRemoteLayoutHandling,
    qx.ui.core.MResizable,
    qx.ui.core.MMovable,
    qx.ui.core.MContentPadding
  ],

  /**
   * @param caption {String} The caption text
   * @param icon {String} The URL of the caption bar icon
   */
  construct : function(caption, icon) {
    this.base(arguments);

    // configure internal layout
    this._setLayout(new qx.ui.layout.VBox());

    // force creation of captionbar
    this._createChildControl("captionbar");
    this._createChildControl("pane");

    // apply constructor parameters
    if (icon != null) {
      this.setIcon(icon);
    }

    if (caption != null) {
      this.setCaption(caption);
    }

    // Update captionbar
    this._updateCaptionBar();

    // Activation listener
    this.addListener("pointerdown", this._onNodePointerDown, this, true);

    // Focusout listener
    this.addListener("focusout", this._onNodeFocusOut, this);

    // Automatically add to application root.
    qx.core.Init.getApplication().getRoot().add(this);

    // Initialize visibility
    this.initVisibility();

    // Register as root for the focus handler
    qx.ui.core.FocusHandler.getInstance().addRoot(this);

    // A qx.widget.Paper is scrollable
    // all nodes dont have to use Move Frame.
    this.setUseMoveFrame(false);

    if (qx.Class.hasOwnMixin(
        this.constructor,
        qxjoint.widget.node.MJointNode)) {
      this.constructJointNode();
    }
  },

  properties :
  {
    /*
    ---------------------------------------------------------------------------
      INTERNAL OPTIONS
    ---------------------------------------------------------------------------
    */

    // overridden
    appearance :
    {
      refine : true,
      init : "window"
    },


    // overridden
    visibility :
    {
      refine : true,
      init : "excluded"
    },


    // overridden
    focusable :
    {
      refine : true,
      init : true
    },

    /**
     * If the node is active, only one window in a single qxjoint.widget.viewport.Manager could
     *  have set this to true at the same time.
     */
    active :
    {
      check : "Boolean",
      init : false,
      apply : "__applyActive",
      event : "changeActive"
    },

    paper :
    {
        check : "qxjoint.widget.Paper",
        nullable : true,
        apply: "__applyPaper"
    },



    /*
    ---------------------------------------------------------------------------
      BASIC OPTIONS
    ---------------------------------------------------------------------------
    */

    /** Should the node be always on top */
    alwaysOnTop :
    {
      check : "Boolean",
      init : false,
      event : "changeAlwaysOnTop"
    },

    /** The icon of the caption */
    icon :
    {
      check : "String",
      nullable : true,
      apply : "__applyIcon",
      event : "changeIcon",
      themeable : true
    },

    /** The text of the caption */
    caption :
    {
      apply : "__applyCaption",
      event : "changeCaption",
      nullable : true
    },

    /** The text of the statusbar */
    status :
    {
      check : "String",
      nullable : true,
      apply : "__applyStatus",
      event :"changeStatus"
    },




    /*
    ---------------------------------------------------------------------------
      HIDE CAPTIONBAR FEATURES
    ---------------------------------------------------------------------------
    */

    /** Should the remove button be shown */
    showDestroy :
    {
      check : "Boolean",
      init : true,
      apply : "__applyCaptionBarChange",
      themeable : true
    },

    showCaptionInPane :
    {
      check : "Boolean",
      init : false,
      apply : "__applyCaptionBarChange",
      themeable : true
    },

    /*
    ---------------------------------------------------------------------------
      DISABLE CAPTIONBAR FEATURES
    ---------------------------------------------------------------------------
    */

    /** Should the user have the ability to remove the node */
    allowDestroy :
    {
      check : "Boolean",
      init : true,
      apply : "__applyCaptionBarChange"
    },


    /*
    ---------------------------------------------------------------------------
      STATUSBAR CONFIG
    ---------------------------------------------------------------------------
    */

    /** Should the statusbar be shown */
    showStatusbar :
    {
      check : "Boolean",
      init : false,
      apply : "_applyShowStatusbar"
    }
  },

  members :
  {
    destroy : function() {
      if (qx.Class.hasOwnMixin(
          this.constructor,
          qxjoint.widget.node.MJointNode)) {
        this.destroyJointNode();
      }

      this.base(arguments);
    },

    /**
     * Set the window's position relative to its parent
     *
     * @param left {Integer} The left position
     * @param top {Integer} The top position
     */
    moveTo : function(left, top)
    {
      this.setLayoutProperties({
        left : left,
        top : top
      });
    },

    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */

    /**
     * The children container needed by the {@link qx.ui.core.MRemoteChildrenHandling}
     * mixin
     *
     * @return {qx.ui.container.Composite} pane sub widget
     */
    getChildrenContainer : function() {
      return this.getChildControl("pane");
    },


    // overridden
    /**
     * @lint ignoreReferenceField(_forwardStates)
     */
    _forwardStates :
    {
      active : true,
      showStatusbar : true
    },


    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "statusbar":
          control = new qx.ui.container.Composite(new qx.ui.layout.HBox());
          this._add(control);
          control.add(this.getChildControl("statusbar-text"));
          break;

        case "statusbar-text":
          control = new qx.ui.basic.Label();
          control.setValue(this.getStatus());
          break;

        case "pane":
          control = new qx.ui.container.Composite();
          this._add(control, {flex: 1});
          break;

        case "pane-caption":
          control = new qx.ui.basic.Label(this.getCaption());
          control.setTextAlign("center");
          // control.setCenter(true);
          var pane = this.getChildControl("pane");
          pane.setLayout(new qx.ui.layout.VBox());
          pane.add(control);
          break;

        case "captionbar":
          // captionbar
          var layout = new qx.ui.layout.Grid();
          layout.setRowFlex(0, 1);
          layout.setColumnFlex(1, 1);
          control = new qx.ui.container.Composite(layout);
          this._add(control);

          // register as move handle
          this._activateMoveHandle(control);
          break;

        case "icon":
          control = new qx.ui.basic.Image(this.getIcon());
          this.getChildControl("captionbar").add(control, {row: 0, column:0});
          break;

        case "title":
          control = new qx.ui.basic.Label(this.getCaption());
          control.setWidth(0);
          control.setAllowGrowX(true);

          var captionBar = this.getChildControl("captionbar");
          captionBar.add(control, {row: 0, column:1});
          break;

        case "destroy-button":
          control = new qx.ui.form.Button();
          control.setFocusable(false);
          control.addListener("execute", this._onDestroyButtonTap, this);

          this.getChildControl("captionbar").add(control, {row: 0, column:6});
          break;
      }

      return control || this.base(arguments, id);
    },





    /*
    ---------------------------------------------------------------------------
      CAPTIONBAR INTERNALS
    ---------------------------------------------------------------------------
    */

    /**
     * Updates the status and the visibility of each element of the captionbar.
     */
    _updateCaptionBar : function()
    {
      var btn;

      var icon = this.getIcon();
      if (icon) {
        this.getChildControl("icon").setSource(icon);
        this._showChildControl("icon");
      } else {
        this._excludeChildControl("icon");
      }

      var caption = this.getCaption();
      if (caption && !this.getShowCaptionInPane()) {
        this.getChildControl("title").setValue(caption);
        this._showChildControl("title");
      } else if (caption && this.getShowCaptionInPane()) {
        this.getChildControl("pane-caption").setValue(caption);
        this._showChildControl("pane-caption");

        this._excludeChildControl("title");
      } else {
        this._excludeChildControl("title");
      }

      if (this.getShowDestroy())
      {
        this._showChildControl("destroy-button");

        btn = this.getChildControl("destroy-button");
        this.getAllowDestroy() ? btn.resetEnabled() : btn.setEnabled(false);
      }
      else
      {
        this._excludeChildControl("remove-button");
      }
    },





    /*
    ---------------------------------------------------------------------------
      USER API
    ---------------------------------------------------------------------------
    */

    /**
     * Centers the window to the parent.
     *
     * This call works with the size of the parent widget and the size of
     * the window as calculated in the last layout flush. It is best to call
     * this method just after rendering the window in the "resize" event:
     * <pre class='javascript'>
     *   win.addListenerOnce("resize", this.center, this);
     * </pre>
     */
    center : function()
    {
      var parent = this.getLayoutParent();
      if (parent)
      {
        var bounds = parent.getBounds();
        if (bounds)
        {
          var hint = this.getSizeHint();

          var left = Math.round((bounds.width - hint.width) / 2);
          var top = Math.round((bounds.height - hint.height) / 2);

          if (top < 0) {
            top = 0;
          }

          this.moveTo(left, top);

          return;
        }
      }

      if (qx.core.Environment.get("qx.debug"))
      {
        this.warn("Centering depends on parent bounds!");
      }
    },



    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY ROUTINES
    ---------------------------------------------------------------------------
    */



    /**
     * Returns the element, to which the content padding should be applied.
     *
     * @return {qx.ui.core.Widget} The content padding target.
     */
    _getContentPaddingTarget : function() {
      return this.getChildControl("pane");
    },


    // property apply
    _applyShowStatusbar : function(value, old)
    {
      // store the state if the status bar is shown
      var resizeFrame = this._getResizeFrame();
      if (value) {
        this.addState("showStatusbar");
        resizeFrame.addState("showStatusbar");
      } else {
        this.removeState("showStatusbar");
        resizeFrame.removeState("showStatusbar");
      }

      if (value) {
        this._showChildControl("statusbar");
      } else {
        this._excludeChildControl("statusbar");
      }
    },


    // property apply
    __applyStatus : function(value, old)
    {
      var label = this.getChildControl("statusbar-text", true);
      if (label) {
        label.setValue(value);
      }

      if (this._applyStatus) {
        this._applyStatus(value, old)
      }
    },


    // overridden
    _applyFocusable : function(value, old)
    {
      // Workaround for bug #7581: Don't set the tabIndex
      // to prevent native scrolling on focus in IE
      if (qx.core.Environment.get("engine.name") !== "mshtml") {
        this.base(arguments, value, old);
      }
    },

    // property apply
    __applyActive : function(value, old)
    {
      if (old) {
        this.removeState("active");
      } else {
        this.addState("active");
      }

      if (this._applyActive) {
        this._applyActive(value, old)
      }
    },

    __applyPaper : function(value, old) {
      if (this._applyPaper) {
        this._applyPaper(value, old);
      }
    },

    __applyIcon : function(value, old) {
      this._updateCaptionBar();

      if (this._applyIcon) {
        this._applyIcon(value, old);
      }
    },

    __applyCaption : function(value, old) {
      this._updateCaptionBar();

      if (this._applyCaption) {
        this._applyCaption(value, old);
      }
    },

    __applyCaptionBarChange : function(value, old) {
      this._updateCaptionBar();

      if (this._applyCaptionBarChange) {
        this._applyCaptionBarChange(value, old);
      }
    },

    /*
    ---------------------------------------------------------------------------
      BASIC EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /**
     * Focuses the window instance.
     *
     * @param e {qx.event.type.Pointer} pointer down event
     */
    _onNodePointerDown : function(e) {
      this.setActive(true);
    },


    /**
     * Listens to the "focusout" event to deactivate the window (if the
     * currently focused widget is not a child of the window)
     *
     * @param e {qx.event.type.Focus} focus event
     */
    _onNodeFocusOut : function(e) {
      // get the current focused widget and check if it is a child
      var current = e.getRelatedTarget();
      if (current != null && !qx.ui.core.Widget.contains(this, current))
      {
        this.setActive(false);
      }
    },

    /**
     * Destroy the node.
     *
     * @param e {qx.event.type.Pointer} pointer pointer event
     */
    _onDestroyButtonTap : function(e)
    {
      this.destroy();
    }
  }
});
