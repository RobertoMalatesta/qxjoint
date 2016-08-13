/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("qxjoint.theme.Decoration",
{
  decorations :
  {
    "selector" :
    {
      style :
      {
        width: 2,
        color: "light-blue",
        style: "dotted"
      }
    },

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
