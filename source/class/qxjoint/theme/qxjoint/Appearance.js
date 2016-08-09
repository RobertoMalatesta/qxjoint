/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("qxjoint.theme.qxjoint.Appearance",
{
  appearances :
  {
    "qxjoint-node-window" :
    {
      style : function(states)
      {
        return {
          contentPadding : [ 10, 10, 10, 10 ],
          backgroundColor: "light-blue",
          textColor: "black",
          decorator : states.maximized ? undefined : states.active ? "qxjoint-node-window-active" : "qxjoint-node-window"
        };
      }
    },

    "qxjoint-node-window/icon" : "window/icon",
    "qxjoint-node-window/captionbar" : "window/captionbar",
    "qxjoint-node-window/title" : "window/title",
    "qxjoint-node-window/pane" :
    {
      style : function(states)
      {
        return {
          backgroundColor: "white"
        };
      }
    },
    "qxjoint-node-window/close-button" : "window/close-button"
  }
});
