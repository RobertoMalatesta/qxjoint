/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "qxjoint"
 *
 * @asset(qxjoint/*)
 * @ignore(joint.*)
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

      var paper = new qxjoint.widget.Paper().set({
        decorator : "main"
      });
      paper.setLinkPinning(false);

      // Logo
      main_container.add(new qx.ui.core.Widget().set({decorator : "main"}),
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
      var leftColumn = new qx.ui.container.SlideBar("vertical");
      var layout = new qx.ui.layout.VBox();
      layout.setSpacing(10);
      leftColumn.setLayout(layout);
      main_container.add(leftColumn, {
        row : 1,
        column : 0
      });


      // Nav paper
      var minimap = new qxjoint.widget.Minimap().set({
        decorator : "main"
      });
      minimap.setPaper(paper);
      minimap.scale(0.2);
      leftColumn.add(minimap);

      // Main content

      paper.addListener("change:jointPaper", function(e) {
        var dns = new qxjoint.node.Window("DNS")
        dns.moveTo(100, 100);
        paper.addNode(dns);

        var router = new qxjoint.node.Window("Router")
        router.moveTo(300, 100);
        paper.addNode(router);

        var c1002 = new qxjoint.widget.Container("C1002");
        c1002.setAutoReorder(true);
        c1002.moveTo(300, 300);
        paper.addNode(c1002);

        var c1002_nignx = new qxjoint.node.Window('NGINX');
        var c1002_varnish = new qxjoint.node.Window('Varnish');
        var c1002_haproxy = new qxjoint.node.Window('haproxy');
        c1002.addNode(c1002_nignx);
        c1002.addNode(c1002_varnish);
        c1002.addNode(c1002_haproxy);

        var c1003 = new qxjoint.widget.Container("C1003");
        c1003.setAutoReorder(true);
        c1003.moveTo(600, 300);
        paper.addNode(c1003);

        var c1003_plone = new qxjoint.node.Window('Plone');
        c1003.addNode(c1003_plone);

        var c1000 = new qxjoint.widget.Container("C1000");
        c1000.setAutoReorder(true);
        c1000.moveTo(100, 500);
        paper.addNode(c1000);

        var c1000_quaive = new qxjoint.node.Window('Quaive');
        c1000.addNode(c1000_quaive);

        var c1001 = new qxjoint.widget.Container("C1001");
        c1001.setAutoReorder(true);
        c1001.moveTo(600, 500);
        paper.addNode(c1001);

        var c1001_quaive = new qxjoint.node.Window('Quaive');
        c1001.addNode(c1001_quaive);

        var link1 = new joint.dia.Link({
            source: { id: dns.getJointNode().id },
            target: { id: router.getJointNode().id }
        });

        var link2 = new joint.dia.Link({
            source: { id: router.getJointNode().id },
            target: { id: c1003_plone.getJointNode().id }
        });

        var link_nginx = new joint.dia.Link({
            source: { id: router.getJointNode().id },
            target: { id: c1002_nignx.getJointNode().id }
        });

        var link_varnish = new joint.dia.Link({
            source: { id: c1002_nignx.getJointNode().id },
            target: { id: c1002_varnish.getJointNode().id }
        });

        var link_haproxy = new joint.dia.Link({
            source: { id: c1002_varnish.getJointNode().id },
            target: { id: c1002_haproxy.getJointNode().id }
        });

        var link_quaive1 = new joint.dia.Link({
            source: { id: c1002_haproxy.getJointNode().id },
            target: { id: c1000_quaive.getJointNode().id }
        });

        var link_quaive2 = new joint.dia.Link({
            source: { id: c1002_haproxy.getJointNode().id },
            target: { id: c1001_quaive.getJointNode().id }
        });

        paper.getJointGraph().addCells([
          link1, link2,
          link_nginx, link_varnish,
          link_quaive1, link_quaive2
        ]);
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
