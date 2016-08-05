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
    extend : qx.ui.core.Widget,

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
        __cssId: null,
        __domElement: null,

        _applyGraph : function(value) {
          var action = qx.lang.Function.bind(function() {
              var el = this.__domElement;

              // Clear existing papers
              if (this.getJointPaper() != null) {
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
              }

              var paper = new joint.dia.Paper({
                  el: el,
                  width: this.getBounds().width,
                  height: this.getBounds().height,
                  model: value,
                  gridSize: 1
              });
              this.setJointPaper(paper);
          }, this);

          if (this.__domElement == null) {
            this.addListenerOnce('appear',function(e){
                var el = this.getContentElement().getDomElement();
                qx.bom.element.Attribute.set(el,'id', this._cssId);

                this.__domElement = el

                action();
            },this);
          } else {
            action();
          }
        },

        addNode : function(node) {
          if (!qx.Class.isSubClassOf(node.constructor, qxjoint.node.Base)) {
            throw new TypeError('"node" must be a subclass of qxjoint.Node.');
          }

          node.create();
          this.getJointGraph().addCells([node.getJointNode()]);

          return this;
        }
    }
});
