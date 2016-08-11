/**
 * @asset(qxjoint/*)
 * @ignore(joint.shapes.basic.Rect)
 */
qx.Class.define("qxjoint.node.Rect",
{
  extend : qx.core.Object,
  include : [qxjoint.node.MJointNode],


  construct : function(caption) {
      this.base(arguments);

      if (caption) {
        this.setCaption(caption);
      }

      this.initSize({width: 100, height: 30, opt: {}});
      this.initPosition({x: 100, y: 60, opts: {}});


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


  properties : {
    backgroundColor :
    {
      event: "changeBackgroundColor",
      init: "blue"
    },
    caption :
    {
      event: "changeCaption",
      init: "new node"
    },
    textColor :
    {
      event: "changeTextColor",
      init: "white"
    }
  },

  members : {
    _makeNode : function() {
      return new joint.shapes.basic.Rect({
          position: this.getJointPosition(),
          size: this.getJointSize(),
          attrs: {
            rect: {
              fill: qx.util.ColorUtil.stringToRgbString(
                this.getBackgroundColor()
              ),
              rx: 4, ry: 4,
              stroke: { 'stroke-width': 0 },
              magnet: true
            },
            text: {
              text: this.getCaption(),
              fill: qx.util.ColorUtil.stringToRgbString(
                this.getTextColor()
              )
            }
          }
      });
    },

    destroy : function()
    {
      this.base(arguments);

      this.destroyJointNode();
    }
  }
});
