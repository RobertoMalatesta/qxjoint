/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("qxjoint.theme.demo.Appearance",
{
  extend : qx.theme.indigo.Appearance,
  include : [ qxjoint.theme.Appearance ],

  appearances :
  {
    "cloud-service" : {
      style : function(states)
      {
        return {
          minWidth: 106,
          minHeight: 54,
          contentPadding : [ 10, 10, 10, 10 ],
          backgroundColor: "cloud-service",
          textColor: "black",
          decorator : states.maximized ? undefined : states.active ? "qxjoint-node-rect-active" : "qxjoint-node-rect"
        };
      }
    },
    "cloud-service/icon" : "qxjoint-container/icon",
    "cloud-service/captionbar" : "qxjoint-container/captionbar",
    "cloud-service/title" : "qxjoint-container/title",
    "cloud-service/pane" : "qxjoint-container/pane",
    "cloud-service/destroy-button" : "qxjoint-container/destroy-button",

    "container" : {
      style : function(states)
      {
        return {
          width: 90,
          height: 90,
          contentPadding : [ 10, 10, 10, 10 ],
          backgroundColor: "container",
          textColor: "black",
          decorator : states.maximized ? undefined : states.active ? "qxjoint-node-rect-active" : "qxjoint-node-rect"
        };
      }
    },
    "container/icon" : "qxjoint-jnodecontainer/icon",
    "container/captionbar" : "qxjoint-jnodecontainer/captionbar",
    "container/title" : "qxjoint-jnodecontainer/title",
    "container/pane" : "qxjoint-jnodecontainer/pane",
    "container/destroy-button" : "qxjoint-jnodecontainer/destroy-button"
  }
});
