/**
 * @ignore(joint.dia.Link)
 */
qx.Class.define("qxjoint.widget.link.Link", {
  extend: qx.core.Object,
  include : [
    qxjoint.widget.link.MLink
  ],

  /**
   * @param source {qxjoint.widget.node.MJointNode}
   * @param target {qxjoint.widget.node.MJointNode}
   */
  construct : function(source, target) {
    this.base(arguments);

    this.setSource(source);
    this.setTarget(target);
  },

  members :
  {
    _makeLink : function() {
      return new joint.dia.Link({
        source: { id: this.getSourceJointNode().id },
        target: { id: this.getTargetJointNode().id }
      });
    }
  }
});
