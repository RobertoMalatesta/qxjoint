/**
 * @asset(qxjoint/*)
 * @ignore(joint.shapes.basic.Rect)
 */
qx.Class.define("qxjoint.node.Rect",
{
  extend : qx.core.Object,
  include : [qxjoint.node.MNode],


  construct : function() {
      this.base(arguments);

      this.initSize({width: 100, height: 30, opt: {}});
      this.initPosition({x: 100, y: 60, opts: {}});
  },


  properties : {
    backgroundColor :
    {
      init: "blue"
    },
    text :
    {
      init: "new node"
    },
    textColor :
    {
      init: "white"
    }
  },

  members : {
    _makeNode : function() {
      return new joint.shapes.basic.Rect({
          position: this.getPosition(),
          size: this.getSize(),
          attrs: {
            rect: { fill: this.getBackgroundColor() },
            text: { text: this.getText(), fill: this.getTextColor() }
          }
      });
    }
  }
});
