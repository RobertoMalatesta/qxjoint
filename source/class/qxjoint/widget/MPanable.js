qx.Mixin.define("qxjoint.widget.MPanable", {
  include : [qx.ui.core.MNativeOverflow],

  properties :
  {
    /** Whether the widget is panable */
    panable :
    {
      check : "Boolean",
      init : true
    },

    panForceMiddleMouse :
    {
      check : "Boolean",
      init : false
    }
  },

  members :
  {
    __panHandleActivated : false,
    __panWidget : null,
    __panDomElement : null,
    __panClientLeft : 0,
    __panClientTop : 0,

    _activatePanHandle : function(clickableWidget)
    {
      if (this.__panHandleActivated) {
        throw new Error("Can't activate the panhandle twice!");
      }

      if (!clickableWidget) {
        clickableWidget = this;
      } else {
        this.__panWidget = clickableWidget;
      }

      this.__panDomElement = this.getContentElement().getDomElement();
      this.__panHandleActivated = true;
      clickableWidget.addListener("pointerdown", this._onPanPointerDown, this);
      clickableWidget.addListener("pointerup", this._onPanPointerUp, this);
      clickableWidget.addListener("pointermove", this._onPanPointerMove, this);
      clickableWidget.addListener("losecapture", this.__onPanLoseCapture, this);
    },

    _deactivatePanHandle : function()
    {
      if (!this.__panHandleActivated) {
        throw new Error("Pan handle not activated!");
      }

      this.__panWidget.removeListener("pointerdown", this._onPanPointerDown, this);
      this.__panWidget.removeListener("pointerup", this._onPanPointerUp, this);
      this.__panWidget.removeListener("pointermove", this._onPanPointerMove, this);
      this.__panWidget.removeListener("losecapture", this.__onPanLoseCapture, this);

      this.__panDomElement = null;
      this.__panHandleActivated = false;
    },

    _onPanPointerDown : function(e)
    {
      if (!this.getPanable()) {
        return;
      }

      // Prevent paning if not clicked on the clickable widget.
      if (this.__panWidget && e.getTarget() != this.__panWidget) {
        return;
      }

      if (this.getPanForceMiddleMouse() && e.getButton() != "middle") {
        return;
      }

      this.setCursor("move");

      this.__panClientLeft = e.getDocumentLeft();
      this.__panClientTop = e.getDocumentTop();

      this.addState("pan");
    },

    _onPanPointerUp : function(e)
    {
      if (!this.hasState("pan")) {
        return;
      }

      this.setCursor("default");

      this.removeState("pan");
    },

    _onPanPointerMove : function(e)
    {
      if (!this.hasState("pan")) {
        return;
      }

      // Calculate Pan
      var domEl = this.getContentElement().getDomElement();
      var dx = e.getDocumentLeft() - this.__panClientLeft;
      var dy = e.getDocumentTop() - this.__panClientTop;

      // Set Pan
      domEl.scrollTop -= dy;
      domEl.scrollLeft -= dx;

      // Store position for the next pan.
      this.__panClientLeft = e.getDocumentLeft();
      this.__panClientTop = e.getDocumentTop();
    },

    __onPanLoseCapture : function(e)
    {
      if (!this.hasState("pan")) {
        return;
      }

      // Remove pan state
      this.removeState("pan");
    }
  }
});
