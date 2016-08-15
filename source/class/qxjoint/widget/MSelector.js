qx.Mixin.define("qxjoint.widget.MSelector", {
  properties :
  {
    /** Whether the widget can select other widgets */
    selectorEnabled :
    {
      check : "Boolean",
      init : true
    },

    selectorForceMouse :
    {
      nullable : true
    }
  },

  members :
  {
    __selectorActivated : false,
    __selectorClickWidget : null,

    /* Per select session variables */
    __selectorWidget : null,
    __selectorClientLeft : 0,
    __selectorClientTop : 0,
    __sthisLocation : null,
    __sScrollLeft : 0,
    __sScrollTop : 0,

    /**
     * @return {Integer} The Position of horizontal bar.
     */
    getScrollX : function()
    {
      var domEl = this.getContentElement().getDomElement();
      return domEl.scrollLeft;
    },

    /**
     * @return {Integer} The Position of vertical bar.
     */
    getScrollY : function()
    {
      var domEl = this.getContentElement().getDomElement();
      return domEl.scrollTop;
    },

    _activateSelector : function(clickableWidget)
    {
      if (this.__selectorActivated) {
        throw new Error("Can't activate the MSelectable twice!");
      }

      if (!clickableWidget) {
        this.__selectorClickWidget = this;
      } else {
        this.__selectorClickWidget = clickableWidget;
      }

      this.__selectorActivated = true;
      this.__selectorClickWidget.addListener("pointerdown", this._onSelectorPointerDown, this);
      this.__selectorClickWidget.addListener("pointerup", this._onSelectorPointerUp, this);
      this.__selectorClickWidget.addListener("pointermove", this._onSelectorPointerMove, this);
      this.__selectorClickWidget.addListener("losecapture", this._onSelectorLoseCapture, this);
    },

    _deactivateSelector : function()
    {
      if (!this.__selectorActivated) {
        throw new Error("MSelectable is not activated!");
      }

      this.__selectorClickWidget.removeListener("pointerdown", this._onSelectorPointerDown, this);
      this.__selectorClickWidget.removeListener("pointerup", this._onSelectorPointerUp, this);
      this.__selectorClickWidget.removeListener("pointermove", this._onSelectorPointerMove, this);
      this.__selectorClickWidget.removeListener("losecapture", this._onSelectorLoseCapture, this);

      this.__selectorActivated = false;
    },

    _onSelectorPointerDown : function(e) {
      if (!this.getSelectorEnabled()) {
        return;
      }

      // Prevent spaning a selector if not clicked on the clickable widget.
      if (this.__selectorWidget && e.getTarget() != this.__selectorWidget) {
        return;
      }

      if (this.getSelectorForceMouse() &&
          e.getButton() != this.getSelectorForceMouse()) {
        return;
      }

      this.__sScrollLeft = this.getScrollX();
      this.__sScrollTop = this.getScrollY();

      this.__sthisLocation = this.getContentLocation();
      this.__selectorClientLeft = e.getViewportLeft() - this.__sthisLocation.left + this.__sScrollLeft;
      this.__selectorClientTop = e.getViewportTop() - this.__sthisLocation.top + this.__sScrollTop;


      var sw = new qx.ui.core.Widget();
      sw.setLayoutProperties({
        left : this.__selectorClientLeft,
        top : this.__selectorClientTop
      });
      if (this.getMaxZIndex) {
        sw.set({zIndex: this.getMaxZIndex()});
      } else {
        sw.set({zIndex: 1e6});
      }
      sw.setWidth(10);
      sw.setHeight(10);
      sw.setAppearance("selector")

      // Register Pointermove and Pointerup on the widget so we can
      // remove/move on it.
      sw.addListener("pointerup", this._onSelectorPointerUp, this);
      sw.addListener("pointermove", this._onSelectorPointerMove, this);

      this.__selectorWidget = sw;
      this._add(this.__selectorWidget);

      this.addState("selecting");

      if (this.setSelected) {
        this.setSelected(null);
      }
    },

    _onSelectorPointerUp : function(e) {
      if (!this.hasState("selecting")) {
        return;
      }

      this._removeSelector();
    },

    _onSelectorPointerMove : function(e) {
      if (!this.hasState("selecting")) {
        return;
      }

      var currLeft = e.getViewportLeft() - this.__sthisLocation.left + this.__sScrollLeft;
      var currTop = e.getViewportTop() - this.__sthisLocation.top + this.__sScrollTop;

      var sw = this.__selectorWidget;
      if (currLeft > this.__selectorClientLeft) {
        sw.setWidth(currLeft - this.__selectorClientLeft);

      } else {
        sw.setLayoutProperties({
          left : currLeft
        });

        sw.setWidth(this.__selectorClientLeft - currLeft);
      }

      if (currTop > this.__selectorClientTop) {
        sw.setHeight(currTop - this.__selectorClientTop);
      } else {
        sw.setLayoutProperties({
          top : currTop
        });
        sw.setHeight(this.__selectorClientTop - currTop);
      }

      if (this.setSelected) {
        this.setSelected(sw.getBounds());
      }
    },

    _onSelectorLoseCapture : function(e) {
      if (!this.hasState("selecting")) {
        return;
      }

      this._removeSelector();
    },

    _removeSelector : function() {
      this._remove(this.__selectorWidget);
      this.__selectorWidget = null;
      this.__selectorClientLeft = 0;
      this.__selectorClientTop = 0;
      this.__sthisLocation = null;
      this.__sScrollLeft = 0;
      this.__sScrollTop = 0;

      this.removeState("selecting");
    }
  }
});
