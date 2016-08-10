/**
 * A qx.ui.window.Window hides a joint.shapes.basic.Rect under it.
 *
 * All the qxjoint.node.MNode API methods are useless here, use
 * the qx.ui.window.Window.
 *
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

      this.setAppearance("qxjoint-node-window");

      // JointJS Size/Position will get changed.
      this.initSize({width: 100, height: 30, opt: {}});
      this.initPosition({x: 100, y: 60, opts: {}});

      this.addListenerOnce("appear",function(e){
        var bounds = this.getBounds();
        this.setSize({width: bounds.width, height: bounds.height, opt: {}});
        this.onPointerMove();
      }, this);

      this.addListener("changeBackgroundColor", function(e){
        var jNode = this.getJointNode();
        if (!jNode || !this.getBackgroundColor()) {
          return;
        }
        jNode.attr(
          'rect/fill',
          qx.util.ColorUtil.stringToRgbString(this.getBackgroundColor())
        );
      }, this);

      this.addListener("changeTextColor", function(e){
        var jNode = this.getJointNode();
        if (!jNode || !this.getTextColor()) {
          return;
        }
        jNode.attr(
          'text/fill',
          qx.util.ColorUtil.stringToRgbString(this.getTextColor())
        );
      }, this);

      this.addListener("changeCaption", function(e){
        var jNode = this.getJointNode();
        if (!jNode) {
          return;
        }
        jNode.attr('text/text', this.getCaption());
      }, this);
  },

  members : {
    _makeNode : function() {
      var jointNode = new joint.shapes.basic.Rect({
          position: this.getPosition(),
          size: this.getSize(),
          attrs: {
            rect: {
              fill: qx.util.ColorUtil.stringToRgbString(
                this.getBackgroundColor() || "white"
              ),
              rx: 4, ry: 4,
              stroke: { 'stroke-width': 0 },
              magnet: true
            },
            text: {
              text: this.getCaption(),
              fill: qx.util.ColorUtil.stringToRgbString(
                this.getTextColor() || "black"
              )
            }
          }
      });

      this.addListener('resize', function(e) {
        var bounds = e.getData();
        this.setSize({width: bounds.width, height: bounds.height, opt: {}});
      }, this);

      return jointNode;
    },

    _applyPaper : function(value) {
      if (this.getContentElement()) {
        this.fireNonBubblingEvent("pointermove");
      } else {
        this.addListenerOnce("appear",function(e){
          this.fireNonBubblingEvent("pointermove", qx.event.type.Pointer, e);
        }, this);
      }
    },

    onPointerMove : function(e) {
      var domEl = this.getContentElement().getDomElement();
      var paperEl = this.getPaper().getContentElement().getDomElement();

      if (domEl && paperEl)
      {
        var myRect = domEl.getBoundingClientRect(),
            paperRect = paperEl.getBoundingClientRect(),
            left = myRect.left - paperRect.left + paperEl.scrollLeft,
            top = myRect.top - paperRect.top + paperEl.scrollTop;

        this.setPosition({
          x: left,
          y: top,
          opts: {}
        });
      }
    },

    // Overriden
    close : function() {
      this.destroy();
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

      this.onPointerMove(e);
    },

    destroy : function()
    {
      this.base(arguments);

      this.destroyJointNode();
    }
  }
});
