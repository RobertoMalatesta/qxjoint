/**
 * @asset(qxjoint/*)
 */
qx.Class.define("qxjoint.node.Base", {
  extend : qx.core.Object,

  construct : function() {
      this.base(arguments);
  },

  properties : {
      position :
      {
        deferredInit : true,
        event: "change:position",
        apply: "_applyPosition"
      },

      size :
      {
        deferredInit : true,
        event: "change:size",
        apply: "_applySize"
      },

      jointNode :
      {
        event: "change:node",
        nullable: true
      }
  },

  members : {
    // overridden
    _makeNode : function () {
      throw new Error("Do not use qxjoint.node.Base directly, " +
                      "extend it and implement the member _makeNode.");
    },

    create : function () {
      var node = this._makeNode();
      node.qx = this;

      node.on('change:position', function(element) {
        this._dontApplyPosition = true;
        this.setPosition(element.get('position'));
        this._dontApplyPosition = false;
      }, this);

      node.on('change:size', function(element) {
        this._dontApplySize = true;
        this.setSize(element.get('size'));
        this._dontApplySize = false;
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
        this.addListenerOnce('change:node',function(e){
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

    destruct : function () {
      if (this.getJointNode() != null) {
        this.getJointNode().remove();
      }
    },

    _dontApplyPosition : false,
    _applyPosition : function(value) {
      if (this._dontApplyPosition) {
        return;
      }

      if (this.getJointNode() != null) {
        var x = value.x || 0,
            y = value.y || 0,
            opts = value.opts || {};

        this.getJointNode().position(x, y, opts);
      }
    },

    _dontApplySize : false,
    _applySize : function(value) {
      if (this._dontApplySize) {
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
