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
    this.__cssId = "#qxjointmm-"+ID;

    this.addListener("resize", function(e) {
      this.scaleContentToFit({padding: 5});
    }, this);
    this.scaleContentToFit({padding: 5});
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

  scaleContentToFit : function(opts) {
    var action = qx.lang.Function.bind(function() {
      var jPaper = this.getJointPaper();
      bounds = this.getBounds();
      jPaper.setDimensions(bounds.width - 12, bounds.height - 12);
      jPaper.scaleContentToFit(opts);
    }, this);

    if (this.getJointPaper()) {
      action();
    } else {
      this.addListenerOnce("change:jointPaper", function(e) {
        action();
      }, this);
    }
  },

   scale : function(sx, sy, ox, oy) {
     var sy = sy || sx
     var action = qx.lang.Function.bind(function() {
       var jPaper = this.getJointPaper();
        jPaper.scale(sx, sy, ox, oy);
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
             gridSize: 1,
             linkPinning: false,
             async: true
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
