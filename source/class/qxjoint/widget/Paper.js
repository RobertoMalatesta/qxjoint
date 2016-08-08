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

    include : [qxjoint.MGraph],

    construct : function() {
      this.base(arguments);

      ID++;
      this.__cssId = '#qxjoint-'+ID;

      // Add start every paper has its own Graph
      // You can override the graph of this paper with
      // setGraph though.
      this.addListenerOnce('appear', function(e) {
        this.setJointGraph(new joint.dia.Graph);
      }, this);
    },

    properties: {
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

      _applyGraph : function(value) {
        // Clear existing papers
        if (this.getJointGraph()) {
          this.removeAll();
        }

        var widget = new qx.ui.embed.Html();
        var bounds = this.getBounds();
        widget.setUserBounds(0, 0, bounds.width, bounds.height)
        this.add(widget);

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
                gridSize: 1,
                linkPinning: false
            });
            this.setJointPaper(paper);
        }, this);
      },

      /**
       * Add a either a wrapped JointJS node and/or a qx.ui.core.Widget.
       *
       * gets called by qxjoint.MGraphHolder.addNode()
       */
      _addNode : function(node) {
        if (qx.Class.hasOwnMixin(node.constructor, qxjoint.node.MNode)) {
          node.setPaper(this);
        }

        if (qx.Class.isSubClassOf(node.constructor, qx.ui.core.Widget)) {
          this._add(node);
          node.show();
        }

        if (qx.Class.hasOwnMixin(node.constructor, qxjoint.MGraph)) {
          node.setJointGraph(this.getJointGraph());
        }
      }
    }
});
