/**
 * A ViewPort can hold nodes.
 */
qx.Class.define("qxjoint.widget.viewport.ViewPort",
{
  extend : qx.ui.core.Widget,

  include : [
    qx.ui.core.MChildrenHandling
  ],

  construct : function(nodeManager)
  {
    this.base(arguments);

    this.getContentElement().disableScrolling();
    this._setLayout(new qx.ui.layout.Canvas().set({
      desktop: true
    }));
    if (nodeManager) {
      this.setNodeManager(nodeManager);
    }
  },

  events:
  {
    /**
     * Fired when a node was added.
     */
    nodeAdded: "qx.event.type.Data",

    /**
     * Fired when a node was removed.
     */
    nodeRemoved: "qx.event.type.Data"
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    _nodes : null,
    __manager: null,


    /**
     * Get the desktop's window manager. Each desktop must have a window manager.
     * If none is configured the default window manager {@link qx.ui.window.Window#DEFAULT_MANAGER_CLASS}
     * is used.
     *
     * @return {qx.ui.window.IWindowManager} The desktop's window manager
     */
    getNodeManager : function()
    {
      if (!this.__manager) {
        this.setNodeManager(new qxjoint.widget.viewport.Manager());
      }
      return this.__manager;
    },


    /**
     * Whether the configured layout supports a maximized window
     * e.g. is a Canvas.
     *
     * @return {Boolean} Whether the layout supports maximized windows
     */
    supportsMaximize : function() {
      return true;
    },

    /**
     * Sets the desktop's window manager
     *
     * @param manager {qx.ui.window.IWindowManager} The window manager
     */
    setNodeManager : function(manager)
    {
      if (this.__manager) {
        this.__manager.setViewPort(null);
      }

      manager.setViewPort(this);
      this.__manager = manager;
    },


    /**
     * Event handler. Called if one of the managed windows changes its active
     * state.
     *
     * @param e {qx.event.type.Event} the event object.
     */
    _onChangeActive : function(e)
    {
      this.getNodeManager().updateStack();
    },

    /**
     * Overrides the method {@link qx.ui.core.Widget#_afterAddChild}
     *
     * @param win {qx.ui.core.Widget} added widget
     */
    _afterAddChild : function(node)
    {
      if (qx.Class.isSubClassOf(node.constructor, qxjoint.widget.node.BaseNode)) {
        this._addNode(node);
      }
    },


    /**
     * Handles the case, when a window is added to the desktop.
     *
     * @param win {qx.ui.window.Window} Window, which has been added
     */
    _addNode : function(node)
    {
      if (!qx.lang.Array.contains(this.getNodes(), node))
      {
        this.getNodes().push(node);

        this.fireDataEvent("nodeAdded", node);

        node.addListener("changeActive", this._onChangeActive, this);
      }

      if (node.getActive()) {
        this.setActiveNode(node);
      }

      this.getNodeManager().updateStack();
    },


    /**
     * Overrides the method {@link qx.ui.core.Widget#_afterRemoveChild}
     *
     * @param win {qx.ui.core.Widget} removed widget
     */
    _afterRemoveChild : function(node)
    {
      if (qx.Class.isSubClassOf(node.constructor, qxjoint.widget.node.BaseNode)) {
        this._removeNode(node);
      }
    },


    /**
     * Handles the case, when a node is removed from the viewport.
     *
     * @param win {qx.ui.window.Window} Window, which has been removed
     */
    _removeNode : function(node)
    {
      if (qx.lang.Array.contains(this.getNodes(), node))
      {
        qx.lang.Array.remove(this.getNodes(), node);

        this.fireDataEvent("nodeRemoved", node);

        node.removeListener("changeActive", this._onChangeActive, this);

        this.getNodeManager().updateStack();
      }
    },


    /**
     * Get a list of all windows added to the desktop (including hidden windows)
     *
     * @return {qx.ui.window.Window[]} Array of managed windows
     */
    getNodes : function()
    {
      if (!this._nodes) {
        this._nodes = [];
      }
      return this._nodes;
    }
  },





  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this._disposeArray("_nodes");
    this._disposeObjects("__manager");
  }
});
