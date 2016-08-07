/**
 * @asset(qxjoint/*)
 * @ignore(joint.shapes.basic.Rect)
 */
qx.Class.define("qxjoint.node.Window",
{
  extend : qx.ui.window.Window,
  include : [qxjoint.node.MNode],

  construct : function(caption, icon) {
      this.base(arguments, caption, icon);

      this.setShowMaximize(false);
      this.setShowMinimize(false);

      this.initSize({width: 100, height: 30, opt: {}});
      this.initPosition({x: 100, y: 60, opts: {}});

      this.addListenerOnce('appear',function(e){
        var bounds = this.getBounds();
        this.setSize({width: bounds.width, height: bounds.height, opt: {}});
        this.setPosition({x: bounds.left, y: bounds.top, opts: {}});
      }, this);
  },

  members : {
    __dragRange : null,
    __dragLeft : null,
    __dragTop : null,
    __parentLeft : null,
    __parentTop : null,

    _makeNode : function() {
      var jointNode = new joint.shapes.basic.Rect({
          position: this.getPosition(),
          size: this.getSize(),
          attrs: {
            rect: { fill: "blue", rx: 4, ry: 4, stroke: { 'stroke-width': 0 } },
            text: { text: this.getCaption(), fill: "white" }
          }
      });

      this.addListener('resize', function(e) {
        var bounds = e.getData();
        this.setSize({width: bounds.width, height: bounds.height, opt: {}});
      }, this);

      return jointNode;
    },

    /**
     * Computes the new drag coordinates
     *
     * @param e {qx.event.type.Pointer} Pointer event
     * @return {Map} A map with the computed drag coordinates
     */
    __computeMoveCoordinates2 : function(e)
    {
      var range = this.__dragRange;
      var pointerLeft = Math.max(range.left, Math.min(range.right, e.getDocumentLeft()));
      var pointerTop = Math.max(range.top, Math.min(range.bottom, e.getDocumentTop()));

      var viewportLeft = this.__dragLeft + pointerLeft;
      var viewportTop = this.__dragTop + pointerTop;

      return {
        viewportLeft : parseInt(viewportLeft, 10),
        viewportTop : parseInt(viewportTop, 10),

        parentLeft : parseInt(viewportLeft - this.__parentLeft, 10),
        parentTop : parseInt(viewportTop - this.__parentTop, 10)
      };
    },

    /**
     * Does the moving of the window by rendering the position
     * of the window (or frame) at runtime using direct dom methods.
     *
     * @param e {qx.event.type.Pointer} pointer move event
     *
     * this overwrites: qx.ui.core.MMoveable._onMovePointerMove().
     */
    _onMovePointerMove : function(e)
    {
      // Only react when dragging is active
      if (!this.hasState("move")) {
        return;
      }

      // Apply new coordinates using DOM
      var coords = this.__computeMoveCoordinates2(e);
      if (this.getUseMoveFrame()) {
        this.__getMoveFrame().setDomPosition(
          coords.viewportLeft,
          coords.viewportTop
        );
        this.getJointNode().setPosition({
          x: coords.viewportLeft,
          y: coords.viewportTop,
          opts: {}
        });
      } else {
        var insets = this.getLayoutParent().getInsets();
        this.setDomPosition(
          coords.parentLeft - (insets.left || 0),
          coords.parentTop - (insets.top || 0)
        );
        this.setPosition({
          x: coords.parentLeft - (insets.left || 0),
          y: coords.parentTop - (insets.top || 0),
          opts: {}
        });
      }

      e.stopPropagation();
    }
  }
});
