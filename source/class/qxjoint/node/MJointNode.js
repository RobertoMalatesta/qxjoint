qx.Mixin.define("qxjoint.node.MJointNode",
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
    }
  }
});
