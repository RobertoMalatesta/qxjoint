/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "qxjoint"
 *
 * @asset(qx/icon/${qx.icontheme}/22/actions/document-new.png)
 * @asset(qx/icon/${qx.icontheme}/22/actions/edit-copy.png)
 * @asset(qxjoint_demo/icon/22x22/*)
 * @asset(qxjoint_demo/icon/16x16/*)
 */
qx.Class.define("qxjoint_demo.Application",
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
      paper.setLinkClass(qxjoint.widget.link.ResourceLink);

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
      var leftColumnLayout = new qx.ui.layout.VBox();
      leftColumnLayout.setSpacing(10);
      var leftColumn = new qx.ui.container.Composite(leftColumnLayout).set({
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

      // Add buttons
      var abContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
        padding : 10,
        decorator : "main"
      });
      leftColumn.add(abContainer);

      var abLabel = new qx.ui.basic.Label("<strong>" + this.tr("Add Node") + "</strong>");
      abLabel.setRich(true);
      abLabel.setTextAlign("center");
      abContainer.add(abLabel)


      var bAddRect = new qx.ui.form.Button("Add Rect");
      bAddRect.addListener("execute", function(e) {
        var node = new qxjoint.widget.node.Rect("Rect")
        node.moveTo(10, 10);
        paper.addNode(node);
      }, this);
      abContainer.add(bAddRect);

      var bAddJNodeContainer = new qx.ui.form.Button("Add JNodeContainer");
      bAddJNodeContainer.addListener("execute", function(e) {
        var node = new qxjoint.widget.node.JNodeContainer("JNodeContainer")
        node.moveTo(10, 10);
        paper.addNode(node);
      }, this);
      abContainer.add(bAddJNodeContainer);

      var bAddContainer = new qx.ui.form.Button("Add Container");
      bAddContainer.addListener("execute", function(e) {
        var node = new qxjoint.widget.node.Container("Container")
        node.moveTo(10, 10);
        paper.addNode(node);
      }, this);
      abContainer.add(bAddContainer);


      leftColumn.add(this.getResourceContainer());


      // Right content column
      var paper_container = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
        decorator : "main"
      });
      crow.add(paper_container, 1);

      //
      var paper_toolbar = new qx.ui.toolbar.ToolBar();
      paper_container.add(paper_toolbar);
      //s
      var part1 = new qx.ui.toolbar.Part();
      var tb_btn_containers = new qx.ui.toolbar.RadioButton("Nodes", "icon/22/actions/document-new.png");
      var tb_btn_links = new qx.ui.toolbar.RadioButton("Links", "icon/22/actions/edit-copy.png");
      var radioGroup = new qx.ui.form.RadioGroup(tb_btn_containers, tb_btn_links);
      part1.add(tb_btn_containers);
      part1.add(tb_btn_links);
      paper_toolbar.add(part1)
      paper_container.add(paper, {flex: 1});

      // Toolbar commands
      radioGroup.addListener("changeSelection", function(e) {
        paper.toggleShowLinks();
      }, this);

      // Main content
      paper.addListener("change:jointPaper", function(e) {
        var dns = new qxjoint.widget.node.Rect("DNS", "qxjoint_demo/icon/22x22/cloud-service/dns.png");
        dns.setAppearance("cloud-service");
        dns.setWidth(130);
        dns.moveTo(10, 100);
        paper.addNode(dns);

        var router = new qxjoint.widget.node.Rect("Router", "qxjoint_demo/icon/22x22/cloud-service/router.png");
        router.setAppearance("cloud-service");
        router.setWidth(130);
        router.moveTo(363, 94);
        paper.addNode(router);

        // Link router with DNS
        var rd_link = new qxjoint.widget.link.ResourceLink(router, dns);
        paper.addLink(rd_link);

        var c1002 = new qxjoint.widget.node.JNodeContainer("C1002", "qxjoint_demo/icon/22x22/container/lxd.png");
        c1002.setWidth(121);
        c1002.setAppearance("container");
        c1002.setAutoReorder(true);
        c1002.moveTo(362, 295);
        paper.addNode(c1002);

        var c1002_nignx = new qxjoint.widget.node.Rect('NGINX');
        var c1002_varnish = new qxjoint.widget.node.Rect('Varnish');
        var c1002_haproxy = new qxjoint.widget.node.Rect('haproxy');
        c1002.addNode(c1002_nignx);
        c1002.addNode(c1002_varnish);
        c1002.addNode(c1002_haproxy);

        // Link C1002_Nginx with the router
        var c1002_router_link = new qxjoint.widget.link.ResourceLink(c1002_nignx, router);
        paper.addLink(c1002_router_link);
        paper.addLink(new qxjoint.widget.link.ResourceLink(c1002_nignx, c1002_varnish));
        paper.addLink(new qxjoint.widget.link.ResourceLink(c1002_varnish, c1002_haproxy));


        var c1003 = new qxjoint.widget.node.JNodeContainer("C1003", "qxjoint_demo/icon/22x22/container/lxd.png");
        c1003.setWidth(121);
        c1003.setAppearance("container");
        c1003.setAutoReorder(true);
        c1003.moveTo(728, 48);
        paper.addNode(c1003);

        var c1003_plone = new qxjoint.widget.node.Rect('Plone');
        c1003.addNode(c1003_plone);

        var c1003_router_link = new qxjoint.widget.link.ResourceLink(c1003_plone, router);
        paper.addLink(c1003_router_link);

        var c1000 = new qxjoint.widget.node.JNodeContainer("C1000", "qxjoint_demo/icon/22x22/container/lxd.png");
        c1000.setWidth(121);
        c1000.setAppearance("container");
        c1000.setAutoReorder(true);
        c1000.moveTo(103, 517);
        paper.addNode(c1000);

        var c1000_quaive = new qxjoint.widget.node.Rect('Quaive');
        c1000.addNode(c1000_quaive);
        var c1001_quaive_link = new qxjoint.widget.link.ResourceLink(c1000_quaive, c1002_haproxy);
        paper.addLink(c1001_quaive_link);


        var c1001 = new qxjoint.widget.node.JNodeContainer("C1001", "qxjoint_demo/icon/22x22/container/lxd.png");
        c1001.setWidth(121);
        c1001.setAppearance("container");
        c1001.setAutoReorder(true);
        c1001.moveTo(361, 598);
        paper.addNode(c1001);

        var c1001_quaive = new qxjoint.widget.node.Rect('Quaive');
        c1001.addNode(c1001_quaive);
        var c1001_quaive_link = new qxjoint.widget.link.ResourceLink(c1001_quaive, c1002_haproxy);
        paper.addLink(c1001_quaive_link);
      }, this);

      main_container.getChildren()[0].setWidth(200);
      main_container.getChildren()[2].setWidth(200);
      var application_root = this.getRoot();
      application_root.add(main_container, {edge: 0});
    },

    getResourceContainer : function() {
      var rContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
        padding : 10,
        decorator : "main"
      });
      var rLabel = new qx.ui.basic.Label("<strong>" + this.tr("Resources") + "</strong>");
      rLabel.setRich(true);
      rLabel.setTextAlign("center");
      rContainer.add(rLabel)

      var rList = new qx.ui.form.List;
      rList.add(new qx.ui.form.ListItem("q.customer.com", "qxjoint_demo/icon/16x16/resource/dns.png"));
      rList.add(new qx.ui.form.ListItem("q.your-domain.com", "qxjoint_demo/icon/16x16/resource/dns.png"));
      rList.add(new qx.ui.form.ListItem("plone.com", "qxjoint_demo/icon/16x16/resource/dns.png"));
      rContainer.add(rList);

      rList.setSelectionMode("multi")
      rList.setDraggable(true);
      rList.addListener("dragstart", function(e) {
        e.addAction("copy");

        e.addType("qxjoint/resource");
      });
      rList.addListener("droprequest", function(e)
      {
        var type = e.getCurrentType();

        if (type == "qxjoint/resource")
        {
          var items = this.getSelection();
          var result = []

          for (var i=0, l=items.length; i<l; i++) {
            result.push(new qxjoint.widget.Resource(items[i].getLabel(), items[i].getIcon()));
          }

          // Add data to manager
          e.addData(type, result);
        }
      });

      return rContainer;
    }
  }
});
