qx.Mixin.define("qxjoint.node.MNode",
{
  properties :
  {
    paper :
    {
        check : "qxjoint.widget.Paper",
        nullable : true,
        apply: "__applyPaper"
    }
  },

  members :
  {
    __applyPaper : function(value) {
      if (this._applyPaper) {
        this._applyPaper(value);
      }
    }
  }
});
