qx.Class.define("qxjoint.widget.EmbedHtml", {
    extend : qx.ui.embed.Html,
    include : [qx.ui.core.MNativeOverflow],

    construct : function(html) {
      this.base(arguments, html);

      this.setOverflow("visible", "visible");
    }
});
