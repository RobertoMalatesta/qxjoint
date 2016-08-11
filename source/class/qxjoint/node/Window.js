/**
 * A qx.ui.window.Window hides a joint.shapes.basic.Rect under it.
 *
 * All the qxjoint.node.MJointNode API methods are useless here, use
 * the qx.ui.window.Window.
 *
 * @asset(qxjoint/*)
 * @ignore(joint.shapes.basic.Rect)
 */
qx.Class.define("qxjoint.node.Window",
{
  extend : qx.ui.window.Window,
  include : [
    qxjoint.node.MJointNode,
    qxjoint.node.MNode
  ],
  implement: [
    qxjoint.widget.IMoving
  ],

  construct : function(caption, icon) {
      this.base(arguments, caption, icon);

      this.setShowMaximize(false);
      this.setShowMinimize(false);

      // For our _onMovePointerMove patch.
      this.setUseMoveFrame(false);

      this.setAppearance("qxjoint-node-window");

      // JointJS Size/Position will get changed.
      this.initJointSize({width: 100, height: 30, opt: {}});
      this.initJointPosition({x: 100, y: 60, opts: {}});

      this.addListenerOnce("appear",function(e){
        var bounds = this.getBounds();
        this.setJointSize({width: bounds.width, height: bounds.height, opt: {}});
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
          position: this.getJointPosition(),
          size: this.getJointSize(),
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
        this.setJointSize({width: bounds.width, height: bounds.height, opt: {}});
      }, this);

      return jointNode;
    },

    onPointerMove : function(e) {
      // Move the JointJS node below.
      var paperEl = this.getPaper().getContentElement().getDomElement();
      var domEl = this.getContentElement().getDomElement();

      if (domEl && paperEl)
      {
        var myRect = domEl.getBoundingClientRect(),
            paperRect = paperEl.getBoundingClientRect(),
            left = myRect.left - paperRect.left + paperEl.scrollLeft,
            top = myRect.top - paperRect.top + paperEl.scrollTop;

        this.setJointPosition({
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
      // Only react when dragging is active
      if (!this.hasState("move")) {
        return;
      }

      this.base(arguments, e);

      this.onPointerMove(e);
      this.fireEvent("moving");
    },

    destroy : function()
    {
      this.base(arguments);

      this.destroyJointNode();
    }
  }
});
