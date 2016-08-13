/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("qxjoint.theme.Appearance",
{
  appearances :
  {
    /**
     * Rect node
     */
    "qxjoint-node-rect" :
    {
      style : function(states)
      {
        return {
          width: 90,
          contentPadding : [ 0, 10, 21, 10 ],
          backgroundColor: "light-blue",
          textColor: "black",
          decorator : states.maximized ? undefined : states.active ? "qxjoint-node-rect-active" : "qxjoint-node-rect",
          showCaptionInPane : true
        };
      }
    },

    "qxjoint-node-rect/icon" : "window/icon",
    "qxjoint-node-rect/captionbar" :
    {
      style : function(states)
      {
        var active = states.active && !states.disabled;
        return {
          padding : [5, 5, active ? 2 : 5, 5],
          decorator: active ? "qxjoint-node-rect-caption-active" : "qxjoint-node-rect-caption"
        };
      }
    },
    "qxjoint-node-rect/title" : "window/title",
    "qxjoint-node-rect/destroy-button" : "window/close-button",

    /**
     * Container
     */
    "qxjoint-container" :
    {
      style : function(states)
      {
        return {
          minWidth: 106,
          minHeight: 54,
          contentPadding : [ 10, 10, 10, 10 ],
          backgroundColor: "light-blue",
          textColor: "black",
          decorator : states.maximized ? undefined : states.active ? "qxjoint-node-rect-active" : "qxjoint-node-rect"
        };
      }
    },

    "qxjoint-container/icon" : "window/icon",
    "qxjoint-container/captionbar" : "window/captionbar",
    "qxjoint-container/title" : "window/title",
    "qxjoint-container/pane" :
    {
      style : function(states)
      {
        return {
          backgroundColor: "white"
        };
      }
    },
    "qxjoint-container/destroy-button" : "window/close-button",

    /**
     * Joint Node Container
     */
    "qxjoint-jnodecontainer" :
    {
      style : function(states)
      {
        return {
          minWidth: 121,
          minHeight: 116,
          contentPadding : [ 10, 10, 10, 10 ],
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          textColor: "black",
          decorator : states.maximized ? undefined : states.active ? "qxjoint-node-rect-active" : "qxjoint-node-rect"
        };
      }
    },

    "qxjoint-jnodecontainer/icon" : "window/icon",
    "qxjoint-jnodecontainer/captionbar" : "window/captionbar",
    "qxjoint-jnodecontainer/title" : "window/title",
    "qxjoint-jnodecontainer/pane" :
    {
      style : function(states)
      {
        return {
          backgroundColor: "rgba(255, 255, 255, 0.0)"
        };
      }
    },
    "qxjoint-jnodecontainer/destroy-button" : "window/close-button"
  }
});
