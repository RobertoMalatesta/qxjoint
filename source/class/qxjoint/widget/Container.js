/*
 * @asset(qxjoint/*)
 */
qx.Class.define("qxjoint.widget.Container",
{
  extend : qx.ui.window.Window,
  implement : [
    qxjoint.widget.IMoving
  ],

  construct : function(caption, icon) {
    this.base(arguments, caption, icon);

    this.setShowMaximize(false);
    this.setShowMinimize(false);
    this.setContentPadding(0);

    // For our _onMovePointerMove patch.
    this.setUseMoveFrame(false);

    var layout = new qx.ui.layout.Grow();
    this.setLayout(layout);
    this.set({backgroundColor: "rgba(255,255,255,0.3)"});
  },

  properties : {
    autoReorder : { check: "Boolean", init: false },
    autoReorderSpacing :  { check: "Integer", init: 10 },

    paper :
    {
        check : "qxjoint.widget.Paper"
    }
  },

  members : {
    __desktop : null,

     /**
      * Add a either a wrapped JointJS node and/or a qx.ui.core.Widget.
      *
      * gets called by qxjoint.MGraphHolder.addNode()
      */
    addNode : function(node) {
      if (!this.__desktop) {
         this.__desktop = new qx.ui.window.Desktop(
           this.getPaper().getWindowManager()
         );
         this.add(this.__desktop);
      }

      if (qx.core.Environment.get("qx.debug")) {
        this.assertInstance(node, qxjoint.node.Window);
      }

       this.getPaper().addJointNode(node);
       node.setPaper(this.getPaper());
       node.set({opacity: 1.0})
       node.addListenerOnce(
         "appear",
         this.updateBoundsAndContentsAlignment,
         this
       );

       this.__desktop.add(node);
       var spacing = this.getAutoReorderSpacing();
       node.moveTo(spacing, spacing);
       node.show();
   },

   getNodes : function() {
     return this.__desktop.getWindows();
   },

   updateBoundsAndContentsAlignment : function(e) {
     var spacing = this.getAutoReorderSpacing();
     if (this.getAutoReorder()) {
       var childs = this.getNodes();

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
       }
     }

     var cbHeight = childs[0].getChildControl("captionbar").getBounds().height;
     var wm = length / 2 > 1 ? 2 : 1;
     var hm = Math.round(length / 2 / 2) + 1;
     this.setWidth((wm * width + (wm * spacing)) + spacing + 3)
     this.setHeight((hm * height + (hm * spacing)) + spacing + cbHeight + 3)

     // Wait on second then try to rearange the underlying JointJS nodes.
     var timer = qx.util.TimerManager.getInstance();
     timer.start(function(userData, timerId)
       {
         childs.forEach(function(child) {
           child.onPointerMove();
         });
       },
       0,
       this,
       null,
       1000
     );
   },

   // Overriden
   close : function() {
     var nodes = this.getNodes().slice();
     nodes.forEach(function(child) {
       this.debug(child.getCaption());
       child.destroy();
     }, this);

     this.dispose();
   },

   _onMovePointerMove : function(e) {
     this.base(arguments, e);

     // Only react when dragging is active
     if (!this.hasState("move")) {
       return;
     }

     this.getNodes().forEach(function(child) {
       child.onPointerMove();
     });

     this.fireEvent("moving");
   }
  }
});
