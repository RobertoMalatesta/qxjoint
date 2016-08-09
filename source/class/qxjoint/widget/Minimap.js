var ID = 0;

/**
 * @asset(qxjoint/*)
 * @ignore(joint.*)
 */
qx.Class.define("qxjoint.widget.Minimap",
{
  extend : qx.ui.core.Widget,

  construct : function() {
    this.base(arguments);

    ID++;
    this.__cssId = "#qxjointmm-"+ID;

    this.addListener("resize", function(e) {
      this.scaleContentToFit();
    }, this);
  },

  properties : {
   jointPaper: {
     event: "change:jointPaper",
     nullable: true
   },

   paper: {
     check : "qxjoint.widget.Paper",
     event: "change:paper",
     nullable: true,
     apply: "_applyPaper"
   },

   scalePadding: {
     check: "Integer",
     init: 10
   }
  },

  members : {
   __cssId : null,

  scaleContentToFit : function(opts) {
    opts = opts || {}
    if (!"padding" in opts) {
      opts.padding = this.getScalePadding();
    }
    var action = qx.lang.Function.bind(function() {
      var jPaper = this.getJointPaper();
      var bounds = this.getBounds();
      jPaper.setDimensions(bounds.width - 10, bounds.height - 10);
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

   _onPaperChangeJointNodes : function(e) {
     this.scaleContentToFit();
   },

   _applyPaper : function(value) {
     // Clear existing papers
     if (this.getJointPaper()) {
       this.getPaper().removeListener(
         "change:jointNodes",
         this._onPaperChangeJointNodes
       );
       this.removeAll();
     }

     var action = qx.lang.Function.bind(function() {
         var el = this.getContentElement().getDomElement();
         qx.bom.element.Attribute.set(el,'id', this._cssId);
         el.style["pointer-events"] = 'none';

         var bounds = this.getBounds();
         var paper = new joint.dia.Paper({
             el: el,
             width: bounds.width - 12,
             height: bounds.height - 12,
             model: value.getJointGraph(),
             gridSize: 1,
             linkPinning: false,
             async: true
         });
         this.setJointPaper(paper);

         value.addListener(
           "change:jointNodes",
           this._onPaperChangeJointNodes,
           this
         );
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
