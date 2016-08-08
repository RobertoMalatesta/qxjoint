/*
 * @asset(qxjoint/*)
 */
qx.Class.define("qxjoint.widget.Container",
{
 extend : qx.ui.window.Window,
 include : [qxjoint.MGraph],

 construct : function(caption, icon) {
   this.base(arguments, caption, icon);

   this.setShowMaximize(false);
   this.setShowMinimize(false);
   this.setContentPadding(0);

   // For our _onMovePointerMove patch.
   this.setUseMoveFrame(false);

   var layout = new qx.ui.layout.Grow();
   this.setLayout(layout);
   var desktop = new qx.ui.window.Desktop();
   this.set({backgroundColor: "rgba(255,255,255,0.3)"});
   this.add(desktop);
 },

 properties : {
  autoReorder : { check: "Boolean", init: false },
  autoReorderSpacing :  { check: "Integer", init: 10 }
},

 members : {
   /**
    * Add a either a wrapped JointJS node and/or a qx.ui.core.Widget.
    *
    * gets called by qxjoint.MGraphHolder.addNode()
    */
   _addNode : function(node) {
     if (qx.core.Environment.get("qx.debug")) {
       this.assertInstance(node, qxjoint.node.Window);
     }

     node.setPaper(this.getLayoutParent());
     node.set({opacity: 1.0})
     var desktop = this.getChildren()[0];
     desktop.add(node);
     desktop.getWindows()[0].addListenerOnce(
       "appear",
       this.updateBoundsAndContentsAlignment,
       this
     );
     var spacing = this.getAutoReorderSpacing();
     node.moveTo(spacing, spacing);
     node.show();
   },

   updateBoundsAndContentsAlignment : function(e) {
     var spacing = this.getAutoReorderSpacing();
     if (this.getAutoReorder()) {
       var desktop = this.getChildren()[0];
       var childs = desktop.getWindows();

       var child0Bounds = childs[0].getBounds();
       var width = child0Bounds.width;
       var height = child0Bounds.height;

       var length = childs.length;
       for (var i = 1; i <= length; i++) {
         var mod = i % 2
         var div = Math.floor(i / 2);
         if (mod == 1) {
           childs[i-1].moveTo(
             spacing,
             (div * height + (div * spacing)) + spacing
           );
         } else if (mod == 0) {
           div = Math.floor(div / 2);
           childs[i-1].moveTo(
             spacing * 2 + width,
             ((div * height) + (div * spacing)) + spacing
           );
         }
         childs[i-1].onPointerMove();
       }
     }

     var cbHeight = childs[0].getChildControl("captionbar").getBounds().height;
     var wm = length / 2 > 1 ? 2 : 1;
     var hm = Math.round(length / 2 / 2) + 1;
     this.getCap
     this.setWidth((wm * width + (wm * spacing)) + spacing + 3)
     this.setHeight((hm * height + (hm * spacing)) + spacing + cbHeight + 3)
   },

   _onMovePointerMove : function(e) {
     this.base(arguments, e);

     this.getChildren()[0].getChildren().forEach(function(child) {
       child.onPointerMove();
     });
   }
 }
});
