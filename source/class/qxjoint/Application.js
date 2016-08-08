/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "qxjoint"
 *
 * @asset(qxjoint/*)
 * @asset(qx/icon/${qx.icontheme}/22/actions/document-new.png)
 * @asset(qx/icon/${qx.icontheme}/22/actions/edit-copy.png)
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
      var layout = new qx.ui.layout.Grid(2, 2);
      layout.setColumnFlex(1, 1);
      layout.setRowFlex(1, 1);
      layout.setSpacing(5);
      main_container.setLayout(layout);

      var paper = new qxjoint.widget.Paper();
      paper.setLinkPinning(false);

      // Logo
      layout = new qx.ui.layout.Atom()
      layout.setCenter(true);
      var logocontainer = new qx.ui.container.Composite(layout).set(
      {
        decorator : "main"
      });
      main_container.add(logocontainer, {
        row : 0,
        column : 0
      });
      logocontainer.add(new qx.ui.basic.Label().set({
        value: '<a href="https://github.com/drawstack/qxjoint" target="_blank"><strong style="font-size: 24px;">QxJoint</strong></a>',
        rich: true,
        width: 120
      }));

      // Navigation/toolbar
      layout = new qx.ui.layout.Atom()
      layout.setCenter(true);
      var navcontainer = new qx.ui.container.Composite(layout).set(
      {
        decorator : "main"
      });
      main_container.add(navcontainer,
      {
        row : 0,
        column : 1
      });
      navcontainer.add(new qx.ui.basic.Label().set({
        value: '<strong>An integration library of JointJS into qooxdoo.</strong>',
        rich: true,
        width: 360
      }));

      // Content row
      var  crow = new qx.ui.splitpane.Pane("horizontal");
      main_container.add(crow, {
        row : 1,
        column : 0,
        colSpan: 2
      });

      // Left content column
      var leftColumn = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
        width : 200,
        decorator : "main"
      });
      crow.add(leftColumn, 0);

      // Minimap
      var minimap = new qxjoint.widget.Minimap().set({
        decorator : "main",
        width: 200,
        height: 200
      });
      minimap.setPaper(paper);
      leftColumn.add(minimap);


      // Right content column
      var paper_container = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
        decorator : "main"
      });
      crow.add(paper_container, 1);

      //
      var paper_toolbar = new qx.ui.toolbar.ToolBar();
      paper_container.add(paper_toolbar);
      //
      var part1 = new qx.ui.toolbar.Part();
      var tb_btn_containers = new qx.ui.toolbar.RadioButton("Containers", "icon/22/actions/document-new.png");
      var tb_btn_links = new qx.ui.toolbar.RadioButton("Links", "icon/22/actions/edit-copy.png");
      var radioGroup = new qx.ui.form.RadioGroup(tb_btn_containers, tb_btn_links);
      part1.add(tb_btn_containers);
      part1.add(tb_btn_links);
      paper_toolbar.add(part1)
      paper_container.add(paper, {flex: 1});

      // Toolbar commands
      var toggle_links_cmd = new qx.ui.command.Command("Ctrl+F1")
      toggle_links_cmd.addListener("execute", function(e) {
        paper.toggleShowLinks();
      }, this);
      radioGroup.addListener("changeSelection", function(e) {
        paper.toggleShowLinks();
      }, this);

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
          link_nginx, link_varnish, link_haproxy,
          link_quaive1, link_quaive2
        ]);
      }, this);

      main_container.getChildren()[0].setWidth(200);
      main_container.getChildren()[2].setWidth(200);
      var application_root = this.getRoot();
      application_root.add(main_container, {edge: 0});
    }
  }
});
