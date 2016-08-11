/**
 * This is the main class of contribution "QxD3"
 *
 * @ignore(joint.*)
 */

var ID = 0;

/**
 * @asset(qxjoint/*)
 */
qx.Class.define("qxjoint.widget.Paper", {
    extend : qx.ui.window.Desktop,

    include : [
      qxjoint.widget.MPanable
    ],

    construct : function() {
      this.base(arguments);

      // Overflow / Paning
      this.setOverflow("auto", "auto");
      this.getContentElement().enableScrolling();

      // ID of the widget containing the JointJS paper.
      ID++;
      this.__cssId = '#qxjoint-'+ID;

      // Add start every paper has its own Graph
      // You can override the graph of this paper with
      // setGraph though.
      this.addListenerOnce('appear', function(e) {
        this.setJointGraph(new joint.dia.Graph);
      }, this);

      this.set({backgroundColor: "rgba(255,255,255,0.0)"});

      this.addListener("change:jointNodes", function(e) {
        this.onNodeMove(e);
      }, this);
    },

    events : {
      "change:jointNodes": "qx.event.type.Event"
    },

    properties: {
      jointGraph:
      {
        event: "change:jointGraph",
        apply: "_applyGraph",
        nullable: true
      },

      jointPaper: {
        event: "change:jointPaper",
        nullable: true
      },

      linkPinning : {
        check: "Boolean",
        init: true
      }
    },

    members: {
      __cssId : null,
      __htmlWidget : null,

      _showLinks : false,

      isShowLinks : function() {
        return this._showLinks;
      },

      toggleShowLinks : function() {
        this._showLinks = !this._showLinks

        this.getWindows().forEach(function(win){
          win.set({zIndex: this._showLinks ? 9 : 10});
        }, this);
      },

      _applyGraph : function(value) {
        // Clear existing papers
        if (this.getJointGraph()) {
          this.removeAll();
        }

        var widget = new qx.ui.embed.Html();
        var bounds = this.getBounds();
        widget.setUserBounds(0, 0, bounds.width, bounds.height)
        this.add(widget);

        this._activatePanHandle(widget);
        this.setPanForceMiddleMouse(true);

        this.__htmlWidget = widget;

        widget.addListenerOnce('appear',function(e){
            var el = this.__htmlWidget
              .getContentElement()
              .getDomElement();
            qx.bom.element.Attribute.set(el,'id', this._cssId);

            var paper = new joint.dia.Paper({
                el: el,
                width: this.__htmlWidget.getBounds().width,
                height: this.__htmlWidget.getBounds().height,
                model: value,
                linkPinning: false,
                async: true
            });
            this.setJointPaper(paper);
        }, this);
      },

      /**
       * Add a either a wrapped JointJS node and/or a qx.ui.core.Widget.
       */
      addNode : function(node) {
        if (qx.Class.hasOwnMixin(node.constructor, qxjoint.node.MJointNode)) {
          this.addJointNode(node);
        }

        if (qx.Class.hasOwnMixin(node.constructor, qxjoint.node.MNode) ||
            qx.Class.isSubClassOf(node.constructor, qxjoint.widget.Container)) {
          node.setPaper(this);
        }

        if (qx.Class.isSubClassOf(node.constructor, qx.ui.core.Widget)) {
          this._add(node);
          node.show();
        }

        if (qx.Class.hasOwnMixin(node.constructor, qxjoint.widget.MMoving)) {
          node.addListener("moving", this.onNodeMove, this);
        }
      },

      /**
       * Calls node.create() and adds the resulting node to the
       * current JointJS graph, after that it listens on changes of
       * the jointnode to update a maybe listening minimap.
       */
      addJointNode : function(node) {
        node.create();
        var jointNode = node.getJointNode();
        jointNode.set('z', 1);
        this.getJointGraph().addCell(jointNode);

        node.addListener("change:jointPosition", function(e) {
          this.fireNonBubblingEvent("change:jointNodes");
        }, this);

        node.addListener("change:jointSize", function(e) {
          this.fireNonBubblingEvent("change:jointNodes");
        }, this);
      },

      onNodeMove : function(e) {
        var jPaper = this.getJointPaper();
        if (!jPaper) {
          return;
        }
        jPaper.fitToContent();
        var minBounds = this.getBounds();
        // 15 = No scrollbar.
        this.__htmlWidget.setUserBounds(
          0, 0,
          Math.max(minBounds.width - 15, jPaper.options.width),
          Math.max(minBounds.height - 15, jPaper.options.height)
        );
      },

      destruct : function() {
        this.base(arguments);

        this._deactivatePaneHandle();
      }
    }
});
