/**
 * Manages the zIndex of Nodes.
 */
qx.Class.define("qxjoint.widget.viewport.Manager",
{
  extend : qx.core.Object,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __viewPort : null,

    /** @type {Integer} Minimum zIndex to start with for nodes */
    _minZIndex : 1e5,

    /** @type {Integer} Next zIndex to use to be on Top. */
    _maxZIndex : 1e6,

    setViewPort : function(viewPort)
    {
      this.__viewPort = viewPort;
      this.updateStack();
    },

    getViewPort : function() {
      return this.__viewPort;
    },


    // interface implementation
    updateStack : function()
    {
      // we use the widget queue to do the sorting one before the queues are
      // flushed. The queue will call "syncWidget"
      qx.ui.core.queue.Widget.add(this);
    },


    /**
     * This method is called during the flush of the
     * {@link qx.ui.core.queue.Widget widget queue}.
     */
    syncWidget : function()
    {
      var nodes = this.__viewPort.getNodes();
      // z-index for both Node kinds
      var zIndex = this._minZIndex;
      // +2 for the active Node.
      var zIndexOnTop = zIndex + nodes.length * 2 + 2;
      // marker if there is an active node
      var active = null;

      for (var i = 0, l = nodes.length; i < l; i++)
      {
        var node = nodes[i];

        // We use only every second z index to easily insert a blocker between
        // two nodes
        // AlwaysOnTop Nodes stays on top of Nodes.
        if (node.isAlwaysOnTop()) {
          node.setZIndex(zIndexOnTop);
          zIndexOnTop +=2;

        } else {
          node.setZIndex(zIndex);
          zIndex +=2;
        }

        // store the active node
        if (node.isActive()) {
          active = node;
        }
      }

      if (active) {
        active.setZIndex(zIndex);
      }

      this._maxZIndex = zIndexOnTop;
    },

    /**
     *
     * @return {Integer} Next zIndex to use to be on Top.
     */
    getMaxZIndex : function()
    {
      return this._maxZIndex;
    }
  }
});
