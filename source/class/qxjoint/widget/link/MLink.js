qx.Mixin.define("qxjoint.widget.link.MLink", {
  properties :
  {
    source :
    {
      apply : "__applySource"
    },
    target :
    {
      apply: "__applyTarget"
    },

    sourceJointNode : {},
    targetJointNode : {},

    paper : {
      check: "qxjoint.widget.Paper",
      apply: "__applyPaper"
    },

    jointLink : {
      event : "change:jointLink"
    }
  },

  members :
  {
    create : function() {
      this.setJointLink(this._makeLink());

      this.getPaper().getJointGraph().addCell(this.getJointLink());
    },

    __applySource : function(value, old) {
      this.setSourceJointNode(value.getJointNode());

      if (this._applySource) {
        this._applySource(value, old);
      }
    },

    __applyTarget : function(value, old) {
      this.setTargetJointNode(value.getJointNode());

      if (this._applyTarget) {
        this._applyTarget(value, old);
      }
    },

    __applyPaper : function(value, old) {
      if (this._applyPaper) {
        this._applyPaper(value, old);
      }
    },

    dispose : function() {
      this.base(arguments);

      this.getPaper().getJointGraph().removeCells([this.getJointLink()]);
    }
  }
});
