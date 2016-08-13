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
      var windows = this.__viewPort.getNodes();
      // z-index for all three window kinds
      var zIndex = this._minZIndex;
      var zIndexOnTop = zIndex + windows.length * 2;
      // marker if there is an active window
      var active = null;

      for (var i = 0, l = windows.length; i < l; i++)
      {
        var win = windows[i];

        // take the first node as active node
        active = active || win;

        // We use only every second z index to easily insert a blocker between
        // two nodes
        // AlwaysOnTop Nodes stays on top of Windows.
        if (win.isAlwaysOnTop()) {
          win.setZIndex(zIndexOnTop);
          zIndexOnTop +=2;

        } else {
          win.setZIndex(zIndex);
          zIndex +=2;
        }

        // store the active window
        if (win.isActive() ||
            win.getZIndex() > active.getZIndex()) {
          active = win;
        }
      }

      this._maxZIndex = zIndexOnTop + 2;
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
