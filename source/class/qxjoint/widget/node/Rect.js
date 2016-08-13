/**
 * A qx.ui.window.Window hides a joint.shapes.basic.Rect under it.
 *
 * All the qxjoint.node.MJointNode API methods are useless here, use
 * the qx.ui.window.Window.
 *
 * @ignore(joint.shapes.basic.Rect)
 */
qx.Class.define("qxjoint.widget.node.Rect",
{
  extend : qxjoint.widget.node.BaseNode,
  include : [
    qxjoint.widget.node.MJointNode
  ],

  construct : function(caption, icon) {
      this.base(arguments, caption, icon);

      // We have a JointJS node below, need to move
      // the real object.
      this.setUseMoveFrame(false);

      this.setAppearance("qxjoint-node-rect");
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

      return jointNode;
    }
  }
});
