qx.Class.define("qxjoint.widget.Resource", {
  extend : qx.ui.basic.Atom,

  /**
   * @param label {String} Label to use
   * @param icon {String?null} Icon to use
   */
  construct : function(label, icon) {
    if (qx.core.Environment.get("qx.debug")) {
      this.assertArgumentsCount(arguments, 0, 2);
    }

    this.base(arguments);

    var layout = new qx.ui.layout.HBox();
    this._setLayout(layout);

    if (label != null) {
      this.setLabel(label);
    }

    if (icon !== undefined) {
      this.setIcon(icon);
    }

    this.setAppearance("qxjoint-resource");

    this.getChildControl("destroy-button");
  },

  members : {
    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "label":
          control = new qx.ui.basic.Label(this.getLabel());
          control.setAllowGrowX(true);
          control.setAnonymous(true);
          control.setRich(this.getRich());
          this._add(control, {flex: 1});
          if (this.getLabel() == null || this.getShow() === "icon") {
            control.exclude();
          }
          break;
        case "destroy-button":
          control = new qx.ui.form.Button();
          control.setFocusable(false);
          control.addListener("execute", this._onDestroyButtonTap, this);
          this._add(control)
          break;
      }

      return control || this.base(arguments, id);
    },

    _onDestroyButtonTap : function(e) {
      this.destroy();
    }
  }
});
