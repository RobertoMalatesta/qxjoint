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

      // For our _onMovePointerMove patch.
      this.setUseMoveFrame(false);

      this.initSize({width: 100, height: 30, opt: {}});
      this.initPosition({x: 100, y: 60, opts: {}});

      this.addListenerOnce('appear',function(e){
        var bounds = this.getBounds();
        this.setSize({width: bounds.width, height: bounds.height, opt: {}});
        this.setPosition({x: bounds.left, y: bounds.top, opts: {}});
      }, this);

      this.addListenerOnce('close', function(e){
        this.dispose();
      }, this);
  },

  members : {
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
     * Overwriting qx.ui.core.MMovable._onPointerMove here to set
     * the position of the jointJS element.
     *
     * it requires:
     *   this.setUseMoveFrame(false);
     */
    _onMovePointerMove : function(e) {
      this.base(arguments, e);

      var domEl = this.getContentElement().getDomElement();
      if (domEl)
      {
        this.setPosition({
          x: parseInt(domEl.style.left, 10),
          y: parseInt(domEl.style.top, 10),
          opts: {}
        });
      }
    }
  }
});
