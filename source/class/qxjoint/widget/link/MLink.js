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
      apply: "__applyJointLink"
    }
  },

  members :
  {
    _jointView : null,

    create : function() {
      this.setJointLink(this._makeLink());
    },

    getJointView : function() {
      if (this._jointView) {
        return this._jointView;
      }

      this._jointView = this.getJointLink().findView(this.getPaper().getJointPaper());
      return this._jointView;
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

    __applyJointLink : function(value, old) {
      this._jointView = null;

      if (this._applyJointLink) {
        this._applyJointLink(value, old);
      }
    }
  }
});
