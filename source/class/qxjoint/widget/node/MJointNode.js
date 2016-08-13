qx.Mixin.define("qxjoint.widget.node.MJointNode",
{
  properties : {
      jointPosition :
      {
        deferredInit : true,
        event: "change:jointPosition",
        apply: "_applyJointPosition"
      },

      jointSize :
      {
        deferredInit : true,
        event: "change:jointSize",
        apply: "_applyJointSize"
      },

      jointNode :
      {
        event: "change:jointNode",
        nullable : true
      }
  },

  members : {
    constructJointNode : function() {
      // JointJS Size/Position will get changed.
      this.initJointSize({width: 100, height: 30, opt: {}});
      this.initJointPosition({x: 100, y: 60, opts: {}});

      this.addListenerOnce("appear",function(e){
        var bounds = this.getBounds();
        this.setJointSize({width: bounds.width, height: bounds.height, opt: {}});
        this.moveJointNodeBelow();
      }, this);

      this.addListener("changeBackgroundColor", function(e){
        var jNode = this.getJointNode();
        if (!jNode || !this.getBackgroundColor()) {
          return;
        }
        jNode.attr(
          'rect/fill',
          qx.util.ColorUtil.stringToRgbString(this.getBackgroundColor())
        );
      }, this);

      this.addListener("changeTextColor", function(e){
        var jNode = this.getJointNode();
        if (!jNode || !this.getTextColor()) {
          return;
        }
        jNode.attr(
          'text/fill',
          qx.util.ColorUtil.stringToRgbString(this.getTextColor())
        );
      }, this);

      this.addListener("changeCaption", function(e){
        var jNode = this.getJointNode();
        if (!jNode) {
          return;
        }
        jNode.attr('text/text', this.getCaption());
      }, this);

      this.addListener('resize', function(e) {
        var bounds = e.getData();
        this.setJointSize({width: bounds.width, height: bounds.height, opt: {}});
      }, this);

      this.addListener("pointermove", this.onJointPointerMove, this, true);
    },

    create : function () {
      var node = this._makeNode();
      node.qx = this;

      node.on('change:position', function(element) {
        this._dontApplyJointPosition = true;
        this.setJointPosition(element.get('position'));
        this._dontApplyJointPosition = false;
      }, this);

      node.on('change:size', function(element) {
        this._dontApplyJointSize = true;
        this.setJointSize(element.get('size'));
        this._dontApplyJointSize = false;
      }, this);

      this.setJointNode(node);
    },

    translate : function(tx, ty, opt) {
      if (this.getJointNode() != null) {
        var node = this.getJointNode();
        node.translate(tx, ty, opt);

        this._dontApplyPosition = true;
        this.setPosition(node.get('position'));
        this._dontApplyPosition = false;
      } else {
        this.addListenerOnce('change:jointNode',function(e){
          var node = this.getJointNode();
          node.translate(tx, ty, opt);

          this._dontApplyPosition = true;
          this.setPosition(node.get('position'));
          this._dontApplyPosition = false;
        }, this);
      }

      return this;
    },

    scale : function(sx, sy, origin, opt) {
      this.getJointNode().scale(sx, sy, origin, opt);

      return this
    },

    destroyJointNode : function () {
      if (this.getJointNode() != null) {
        this.getJointNode().remove();
      }
    },

    _dontApplyJointPosition : false,
    _applyJointPosition : function(value) {
      if (this._dontApplyJointPosition) {
        return;
      }

      if (this.getJointNode() != null) {
        var x = value.x || 0,
            y = value.y || 0,
            opts = value.opts || {};

        this.getJointNode().position(x, y, opts);
      }
    },

    _dontApplyJointSize : false,
    _applyJointSize : function(value) {
      if (this._dontApplyJointSize) {
        return;
      }

      if (this.getJointNode() != null) {
        var width = value.width || 0,
            height = value.height || 0,
            opts = value.opts || {};

        this.getJointNode().resize(width, height, opts);
      }
    },

    onJointPointerMove : function(e) {
      // Only react when dragging is active
      if (!this.hasState("move")) {
        return;
      }

      this._onMovePointerMove(e);
      this.moveJointNodeBelow();

      e.stopPropagation();
    },

    moveJointNodeBelow : function() {
      // Move the JointJS node below.
      var paperEl = this.getPaper().getContentElement().getDomElement();
      var domEl = this.getContentElement().getDomElement();

      if (domEl && paperEl)
      {
        var myRect = domEl.getBoundingClientRect(),
            paperRect = paperEl.getBoundingClientRect(),
            left = myRect.left - paperRect.left + paperEl.scrollLeft,
            top = myRect.top - paperRect.top + paperEl.scrollTop;

        this.setJointPosition({
          x: left,
          y: top,
          opts: {}
        });
      }
    }
  }
});
