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
    extend : qxjoint.widget.viewport.Viewport,

    include : [
      qxjoint.widget.MPanable,
      qxjoint.widget.MSelector,
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
      },

      linkClass : {
        init: qxjoint.widget.link.Link
      }
    },

    members: {
      __cssId : null,
      __htmlWidget : null,

      _links : [],

      _showLinks : false,

      isShowLinks : function() {
        return this._showLinks;
      },

      toggleShowLinks : function() {
        this._showLinks = !this._showLinks

        this.getNodes().forEach(function(node){
          node.set({zIndex: this._showLinks ? 9 : 10});
        }, this);

        this._links.forEach(function(link){
          link.set({zIndex: this._showLinks ? 9 : 10});
        }, this);


        if (this._showLinks) {
          this._deactivateSelector();
        } else {
          this._activateSelector(this.__htmlWidget);
        }
      },

      _applyGraph : function(value, old) {
        // Clear existing papers
        if (old) {
          this.removeAll();
          old.off("change:source change:target", this._onJointLinkChange);
          old.off("change", this._onJointGraphChange)
          old.off("remove", this._onJointGraphRemoveCell)
        }

        // Listen for links changes
        value.on("change:source change:target", this._onJointLinkChange, this);
        value.on("remove", this._onJointGraphRemoveCell, this);

        var widget = new qx.ui.embed.Html();
        var bounds = this.getBounds();
        widget.setUserBounds(0, 0, bounds.width, bounds.height)
        this.add(widget);

        // Pan
        this._activatePanHandle(widget);
        this.setPanForceMouse("middle");

        // Selector
        this._activateSelector(widget);
        this.setSelectorForceMouse("left");

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
            value.on("change", this._onJointGraphChange, this);
        }, this);
      },

      addLink : function(link) {
        if (!qx.Class.hasMixin(link.constructor, qxjoint.widget.link.MLink)) {
            throw new Error("A link must be a include of qxjoint.widget.link.MLink");
        }

        this._links.push(link);
        link.setPaper(this);
        link.create();
        this.getJointGraph().addCell(link.getJointLink());

        if (qx.Class.isSubClassOf(link.constructor, qx.ui.core.Widget)) {
          this.add(link);
          link.show();
        }
      },

      _onJointLinkChange : function (jointLink) {
        if (!jointLink.get('source').id || !jointLink.get('target').id) {
          return;
        }

        var found = false;
        for (var i = 0; i < this._links.length; i++) {
          var qxLink = this._links[i];

          if (qxLink.getJointLink().id == jointLink.id) {
            if (qxLink.getSourceJointNode().id != jointLink.get('source').id) {
              var jointNode = this.getJointGraph().getCell(jointLink.get('source').id);
              qxLink.setSource(jointNode.qx);
            }

            if (qxLink.getTargetJointNode().id != jointLink.get('target').id) {
              var jointNode = this.getJointGraph().getCell(jointLink.get('target').id);
              qxLink.setTarget(jointNode.qx)
            }

            found = true;
            break;
          }
        }
        if (!found) {
          var clazz = this.getLinkClass()
          var qxLink = new clazz(
            this.getJointGraph().getCell(jointLink.get('source').id).qx,
            this.getJointGraph().getCell(jointLink.get('target').id).qx
          )
          qxLink.setJointLink(jointLink);
          qxLink.setPaper(this);
          this._links.push(qxLink);

          if (qx.Class.isSubClassOf(qxLink.constructor, qx.ui.core.Widget)) {
            this.add(qxLink);
            qxLink.show();
          }
        }
      },

      _onJointGraphRemoveCell : function(cell) {
        if (cell.isLink()) {
          for (var i = 0; i < this._links.length; i++) {
            var link = this._links[i];
            if (link.getJointLink().id == cell.id) {
              if (qx.Class.isSubClassOf(link.constructor, qx.ui.core.Widget)) {
                this.remove(link);
                link.dispose();
              }
              qx.lang.Array.removeAt(this._links, i);
              break;
            }
          }
        }
      },

      /**
       * Add a either a wrapped JointJS node and/or a qx.ui.core.Widget.
       */
      addNode : function(node) {
        if (qx.Class.hasMixin(node.constructor, qxjoint.widget.node.MJointNode)) {
          this.addJointNode(node);
        }

        if (qx.Class.isSubClassOf(node.constructor, qxjoint.widget.node.BaseNode)) {
          node.setPaper(this);
          this.add(node);
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

      _onJointGraphChange : function(e) {
        var jPaper = this.getJointPaper();
        if (!jPaper) {
          return;
        }
        jPaper.fitToContent();
        var minBounds = this.getBounds();
        // 15 = No scrollbar.
        this.__htmlWidget.setUserBounds(
          0, 0,
          Math.max(minBounds.width - 15, jPaper.options.width + 50),
          Math.max(minBounds.height - 15, jPaper.options.height + 50)
        );
      },

      destruct : function() {
        this.base(arguments);

        this._deactivatePaneHandle();
        this._deactivateSelector();

        this._disposeArray(this._links);
      }
    }
});
