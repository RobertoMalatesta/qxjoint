/**
 * This is the main class of contribution "QxD3"
 *
 * @ignore(joint.*)
 */

var ID = 0;

/**
 * @asset(qxjoint/css/*)
 * @asset(qxjoint/js/*)
 */
qx.Class.define("qxjoint.widget.Paper", {
    extend : qxjoint.widget.viewport.ViewPort,

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

        this.getNodes().forEach(function(win){
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
            value.on('change', this.onJointGraphChange, this);
        }, this);
      },

      /**
       * Add a either a wrapped JointJS node and/or a qx.ui.core.Widget.
       */
      addNode : function(node) {
        if (qx.Class.hasOwnMixin(node.constructor, qxjoint.widget.node.MJointNode)) {
          this.addJointNode(node);
        }

        if (qx.Class.isSubClassOf(node.constructor, qxjoint.widget.node.BaseNode)) {
          node.setPaper(this);
          this._add(node);
          node.show();
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
      },

      onJointGraphChange : function(e) {
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
