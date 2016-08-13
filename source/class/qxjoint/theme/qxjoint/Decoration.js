/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("qxjoint.theme.qxjoint.Decoration",
{
  decorations :
  {
    "qxjoint-node-rect" :
    {
      include: "window",

      style :
      {
        shadowColor : "light-blue",
        innerColor: "light-blue"
      }
    },

    "qxjoint-node-rect-active" :
    {
      include: "window-active",

      style :
      {
        shadowColor : "light-blue",
        innerColor: "light-blue"
      }
    },

    "qxjoint-node-rect-caption" : {
      style :
      {
        radius: [3, 3, 0, 0],
        color: "window-border",
        widthBottom: 0
      }
    },

    "qxjoint-node-rect-caption-active" : {
      style :
      {
        radius: [3, 3, 0, 0],
        color: "highlight",
        widthBottom: 3
      }
    }
  }
});
