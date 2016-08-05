/**
 * @asset(qxjoint/*)
 * @ignore(jQuery)
 * @ignore(joint.*)
 * @ignore(_.bindAll)
 * @ignore(_.template)
 * @ignore(_.bind)
 */
joint.shapes.qx = {};
joint.shapes.qx.Element = joint.shapes.basic.Rect.extend({
    defaults: joint.util.deepSupplement({
        type: 'qx.Element',
        attrs: {
            rect: { stroke: 'none', 'fill-opacity': 0 }
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});


joint.shapes.qx.ElementView = joint.dia.ElementView.extend({

    template: [
        '<div class="html-element">',
          '<button class="delete">x</button>',
          '<label></label>',
          '<span></span>', '<br/>',
          '<select><option>--</option><option>one</option><option>two</option></select>',
          '<input type="text" value="I\'m HTML input" />',
        '</div>'
    ].join(''),

    initialize: function() {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = jQuery(_.template(this.template)());
        // Prevent paper from handling pointerdown.
        this.$box.find('input,select').on('mousedown click', function(evt) { evt.stopPropagation(); });
        // This is an example of reacting on the input change and storing the input data in the cell model.
        this.$box.find('input').on('change', _.bind(function(evt) {
            this.model.set('input', jQuery(evt.target).val());
        }, this));
        this.$box.find('select').on('change', _.bind(function(evt) {
            this.model.set('select', jQuery(evt.target).val());
        }, this));
        this.$box.find('select').val(this.model.get('select'));
        this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
        // Update the box position whenever the underlying model changes.
        this.model.on('change', this.updateBox, this);
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);

        this.updateBox();
    },
    render: function() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
    },
    updateBox: function() {
        // Set the position and dimension of the box so that it covers the JointJS element.
        var bbox = this.model.getBBox();
        // Example of updating the HTML with a data stored in the cell model.
        this.$box.find('label').text(this.model.get('label'));
        this.$box.find('span').text(this.model.get('select'));
        this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
    },
    removeBox: function(evt) {
        this.$box.remove();
    }
});

qx.Class.define("qxjoint.node.Qx", {
  extend : qxjoint.node.Base,

  properties : {
    backgroundColor :
    {
      init: "blue"
    },
    text :
    {
      init: "new node"
    },
    textColor :
    {
      init: "white"
    }
  },

  construct : function() {
      this.base(arguments);

      this.initSize({width: 170, height: 100, opt: {}});
      this.initPosition({x: 100, y: 60, opts: {}});
  },

  members : {
    _makeNode : function() {
      return new joint.shapes.qx.Element({
        position: this.getPosition(),
        size: this.getSize(),
        label: 'I am HTML',
        select: 'one' });
    }
  }
});
