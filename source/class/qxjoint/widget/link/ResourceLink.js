/**
 * @ignore(joint.dia.Link)
 */
qx.Class.define("qxjoint.widget.link.ResourceLink", {
  extend: qx.ui.core.Widget,
  include : [
    qx.ui.core.MChildrenHandling,
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

    var layout = new qx.ui.layout.VBox()
    layout.setSpacing(2);
    this._setLayout(layout)
    this.setAppearance("qxjoint-resourcelink");

    this.setDroppable(true);
    this.addListener("drop", this._onDrop, this);
    this.addListener("dragover", this._onDragOver, this);

    this.addListener("appear", this.centerToLink, this);
    this.addListener("resize", this.centerToLink, this);
  },

  defer : function(statics, members) {
    qx.ui.core.MChildrenHandling.remap(members);
  },

  members :
  {
    _strokeWidth : 1,

    centerToLink : function(e) {
      var bounds = this.getBounds();
      if (!bounds) {
        // Not appeared
        return;
      }

      var jointView = this.getJointView();
      if (!jointView) {
        return;
      }

      var bbox = window.g.rect(window.V(jointView.el).bbox(true)).moveAndExpand({
          x: - this._strokeWidth,
          y: - this._strokeWidth,
          width: 2 * this._strokeWidth,
          height: 2 * this._strokeWidth
      });

      var pLocation = this.getPaper().getContentLocation();

      var left = Math.round(bbox.x + (bbox.width / 2) - (bounds.width / 2));
      var top = Math.round(bbox.y + (bbox.height / 2) - (bounds.height / 2));

      this.setLayoutProperties({
        left : left,
        top : top
      });
    },

    _makeLink : function() {
      return new joint.dia.Link({
        source: { id: this.getSourceJointNode().id },
        target: { id: this.getTargetJointNode().id }
      });
    },

    _applyJointLink : function(value, old) {
      if (old) {
        old.off("change", this.centerToLink);
      }

      value.on("change", this.centerToLink, this);
    },

    _applySource : function(value, old) {
      if (old && old.getJointNode()) {
        old.getJointNode().off("change", this.centerToLink);
      }

      value.getJointNode().on("change", this.centerToLink, this);
    },

    _applyTarget : function(value, old) {
      if (old && old.getJointNode()) {
        old.getJointNode().off("change", this.centerToLink);
      }

      value.getJointNode().on("change", this.centerToLink, this);
    },

    _onDragOver : function(e) {
      if (!e.supportsType("qxjoint/resource")) {
        e.preventDefault();
      }
    },

    _onDrop : function(e)  {
      var items = e.getData("qxjoint/resource");
      for (var i=0, l=items.length; i<l; i++) {
        this.add(items[i]);
      }
    }
  }
});
