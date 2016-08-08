qx.Mixin.define("qxjoint.MGraph",
{
  properties: {
    jointGraph:
    {
      event: "change:jointGraph",
      apply: "__applyGraph",
      nullable: true
    }
  },

  members : {
    addNode : function(node) {
      if (this.getJointGraph() != null) {
        if (qx.Class.hasOwnMixin(node.constructor, qxjoint.node.MNode)) {
          node.create();
          this.getJointGraph().addCell(node.getJointNode());
        }

        if (this._addNode) {
          this._addNode(node);
        }
      } else {
        this.addListenerOnce("appear", function(e) {
          if (qx.Class.hasOwnMixin(node.constructor, qxjoint.node.MNode)) {
            node.create();
            this.getJointGraph().addCell(node.getJointNode());
          }

          if (this._addNode) {
            this._addNode(node);
          }
        }, this);
      }

      return this;
    },

    __applyGraph : function(value) {
      if (this._applyGraph) {
        this._applyGraph(value);
      }
    }
  }
});
