/**
 * This is the main class of contribution "QxD3"
 *
 * @ignore(joint.*)
 */

var ID = 0;

/**
 * @asset(qxjoint/*)
 */
qx.Class.define("qxjoint.PaperWidget", {
    extend : qx.ui.window.Desktop,

    construct : function() {
        this.base(arguments);
        ID++;

        this.__cssId = '#qxjoint-'+ID;

        // Add start every paper has its own Graph
        // You can override the graph of this paper with
        // setGraph though.
        this.setJointGraph(new joint.dia.Graph);
    },

    properties: {
        jointGraph:
        {
          event: "change:graph",
          apply: "_applyGraph"
        },
        jointPaper: {
          event: "change:paper",
          nullable: true
        }
    },

    members: {
        __cssId : null,
        __htmlWidget : null,

        _applyGraph : function(value) {
          var action = qx.lang.Function.bind(function() {
              var el = this.__htmlWidget.getContentElement().getDomElement();

              // Clear existing papers
              if (this.getJointPaper() != null) {
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
              }

              var paper = new joint.dia.Paper({
                  el: el,
                  width: this.__htmlWidget.getBounds().width,
                  height: this.__htmlWidget.getBounds().height,
                  model: value,
                  gridSize: 1
              });
              this.setJointPaper(paper);
          }, this);

          if (this.__htmlWidget == null) {
            this.addListenerOnce('appear', function(e) {
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

                  action();
              },this);
            });
          } else {
            action();
          }
        },

        addNode : function(node) {
          if (!qx.Class.hasOwnMixin(node.constructor, qxjoint.node.MNode)) {
            throw new TypeError(
              '"node" must include the mixin ' +
              'qxjoint.node.MNode.');
          }

          node.create();
          this.getJointGraph().addCells([node.getJointNode()]);

          if (qx.Class.isSubClassOf(node.constructor, qx.ui.core.Widget)) {
            this.add(node);
            node.show();
          }

          return this;
        }
    }
});
