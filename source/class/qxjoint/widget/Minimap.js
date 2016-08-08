var ID = 0;

/**
 * @asset(qxjoint/*)
 * @ignore(joint.*)
 */
qx.Class.define("qxjoint.widget.Minimap",
{
 extend : qx.ui.core.Widget,
 include : [qx.ui.core.MNativeOverflow],

 construct : function() {
   this.base(arguments);
   this.setOverflow("auto", "auto");

   ID++;
   this.__cssId = '#qxjointmm-'+ID;
 },

 properties : {
   jointPaper: {
     event: "change:jointPaper",
     nullable: true
   },

   paper: {
     event: "change:paper",
     nullable: true,
     apply: "_applyPaper"
   }
 },

 members : {
   __cssId : null,

   scale : function(sx, sy, ox, oy) {
     var sy = sy || sx
     var action = qx.lang.Function.bind(function() {
       var jPaper = this.getJointPaper();
       jPaper.scale(sx, sy, ox, oy);
       // jPaper.fitToContent();
      //  this.width = jPaper.width;
      //  this.height = jPaper.height;
     }, this);

     if (this.getJointPaper()) {
       action();
     } else {
       this.addListenerOnce("change:jointPaper", function(e) {
         action();
       }, this);
     }
   },

   _applyPaper : function(value) {
     // Clear existing papers
     if (this.getJointPaper()) {
       this.removeAll();
     }

     var action = qx.lang.Function.bind(function() {
         var el = this.getContentElement().getDomElement();
         qx.bom.element.Attribute.set(el,'id', this._cssId);

         var paper = new joint.dia.Paper({
             el: el,
             width: value.getBounds().width,
             height: value.getBounds().height,
             model: value.getJointGraph(),
             gridSize: 1
         });
         this.setJointPaper(paper);
     }, this);

    if (value.getJointGraph()) {
      action();
    } else {
      value.addListenerOnce("change:jointGraph", function(e) {
        action();
      }, this);
    }

   }
 }
});
