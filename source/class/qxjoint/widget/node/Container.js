/**
 *
 * @ignore(joint.shapes.basic.Rect)
 */
qx.Class.define("qxjoint.widget.node.Container",
{
  extend : qxjoint.widget.node.BaseNode,
  include : [
    qxjoint.widget.node.MJointNode
  ],

  construct : function(caption, icon) {
    this.base(arguments, caption, icon);

    this.setAppearance("qxjoint-container");
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
