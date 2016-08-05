/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "qxjoint"
 *
 * @ asset(qxjoint/*)
 */
qx.Class.define("qxjoint.Application",
{
  extend : qx.application.Standalone,
  members :
  {
    main : function()
    {
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;

        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }
      this.layout();
    },

    layout : function()
    {
      var main_container = new qx.ui.container.Composite();
      var layout = new qx.ui.layout.Grid();
      layout.setColumnFlex(1, 2);
      layout.setRowFlex(1, 3);
      layout.setSpacing(5);
      main_container.setLayout(layout);

      // Logo
      main_container.add(new qx.ui.core.Widget().set( {
        decorator : "main"
      }),
      {
        row : 0,
        column : 0
      });

      // Navigation/toolbar
      main_container.add(new qx.ui.core.Widget().set( {
        decorator : "main"
      }),
      {
        row : 0,
        column : 1
      });

      // Left column
      main_container.add(new qx.ui.core.Widget().set( {
        decorator : "main"
      }),
      {
        row : 1,
        column : 0
      });

      // Main content
      var paper = new qxjoint.PaperWidget().set({
        decorator : "main"
      });
      paper.addListener("change:paper", function(e) {
        var node1 = new qxjoint.node.Rect()
        node1.setText('Node 1');
        var node2 = new qxjoint.node.Qx()
        //node2.setText('Node 2');
        node2.translate(150, 150);
        paper.addNode(node1).addNode(node2);
      }, this);

      main_container.add(paper,
      {
        row : 1,
        column : 1
      });

      main_container.getChildren()[0].setWidth(200);
      main_container.getChildren()[2].setWidth(200);
      var application_root = this.getRoot();
      application_root.add(main_container);
      application_root.addListener("resize", function(e) {
        main_container.set(
        {
          "width" : qx.bom.Viewport.getWidth(),
          "height" : qx.bom.Viewport.getHeight()
        });
      }, this);
    }
  }
});
