/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("qxjoint.theme.Decoration",
{
  extend : qx.theme.indigo.Decoration,

  decorations :
  {
    "qxjoint-node-window" :
    {
      include: "window",

      style :
      {
        shadowColor : "light-blue",
        innerColor: "light-blue"
      }
    },

    "qxjoint-node-window-active" :
    {
      include: "window-active",

      style :
      {
        shadowColor : "light-blue",
        innerColor: "light-blue"
      }      
    }
  }
});
