/**
 * A JNodeContainer holds a qxjoint.widget.viewport.ViewPort which can hold
 * Joint nodes.
 */
 qx.Class.define("qxjoint.widget.node.JNodeContainer",
 {
   extend : qxjoint.widget.node.BaseNode,

   construct : function(caption, icon) {
     this.base(arguments, caption, icon);

     this.setContentPadding(0);

     this.setAppearance("qxjoint-jnodecontainer");

     this.addListener("move", this.onMovePointerMove, this);

     var layout = new qx.ui.layout.Grow();
     this.setLayout(layout);
   },

   properties : {
     autoReorder : { check: "Boolean", init: false },
     autoReorderSpacing :  { check: "Integer", init: 10 }
   },

   members : {
     __viewPort : null,

      /**
       * Add a either a wrapped JointJS node and/or a qx.ui.core.Widget.
       *
       * gets called by qxjoint.MGraphHolder.addNode()
       */
     addNode : function(node) {
        this.getPaper().addJointNode(node);
        node.setPaper(this.getPaper());
        node.set({opacity: 1.0})
        node.addListenerOnce(
          "appear",
          this.updateBoundsAndContentsAlignment,
          this
        );

        this.getViewPort().add(node);
        var spacing = this.getAutoReorderSpacing();
        node.moveTo(spacing, spacing);
        node.show();
    },

    getViewPort : function() {
      if (!this.__viewPort) {
         this.__viewPort = new qxjoint.widget.viewport.ViewPort();
         this.add(this.__viewPort);
      }

      return this.__viewPort;
    },

    getNodes : function() {
      return this.getViewPort().getNodes();
    },

    updateBoundsAndContentsAlignment : function(e) {
      if (!this.getAutoReorder()) {
        return;
      }

      var spacing = this.getAutoReorderSpacing();
      var childs = this.getNodes();
      var length = childs.length;

      if (length < 1) {
        return;
      }

      var child0Bounds = childs[0].getBounds();
      var width = child0Bounds.width;
      var height = child0Bounds.height;


      if (length > 1) {
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

      var cbHeight = this.getChildControl("captionbar").getBounds().height;
      var stHeight = 0;
      if (this.getShowStatusbar()) {
        stHeight = this.getChildControl("statusbar").getBounds().height;
      }
      var wm = length / 2 > 1 ? 2 : 1;
      var hm = Math.round(length / 2 / 2) + 1;
      var insets = this.getInsets();
      this.setMinWidth(
        (wm * width + (wm * spacing)) +
        spacing +
        insets.left + insets.right)
      this.setMinHeight(
        (hm * height + (hm * spacing)) +
        spacing +
        cbHeight +
        stHeight +
        insets.top + insets.bottom)

      if (length == 1) {
        this.addListenerOnce("resize", function(e){
          childs[0].center();
        }, this);
      }

      // TODO: Havent found a way to to do this without a timer yet.
      var timer = qx.util.TimerManager.getInstance();
      timer.start(function(userData, timerId)
        {
          childs.forEach(function(child) {
            child.moveJointNodeBelow();
          });
        },
        0,
        this,
        null,
        0
      );
    },

    _applySelected : function(value, old) {
      this.getNodes().forEach(function(node) {
        node.setSelected(value);
      });
    },

    // Overriden
    destroy : function() {
      var nodes = this.getNodes().slice();
      nodes.forEach(function(node) {
        node.destroy();
      });

      this.base(arguments);
    },

    onMovePointerMove : function(e) {
      this.getNodes().forEach(function(node) {
        node.moveJointNodeBelow();
      });
    }
   }
 });
