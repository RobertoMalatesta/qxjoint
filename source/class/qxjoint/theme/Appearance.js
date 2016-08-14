/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * @asset(qxjoint/decoration/*)
 */
qx.Theme.define("qxjoint.theme.Appearance",
{
  appearances :
  {
    /**
     * The Selector
     */

    "selector" :
    {
      style : function(states)
      {
        return {
          decorator : "selector"
        };
      }
    },

    "qxjoint-destroy-button" :
    {
      alias : "button",
      style : function(states)
      {
        return {
          marginLeft : 2,
          icon : "qxjoint/decoration/close.png",
          padding : [ 1, 2 ],
          cursor : states.disabled ? undefined : "pointer"
        };
      }
    },

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
          decorator : states.maximized ? undefined : states.active ? "qxjoint-node-rect-active" : states.selected ? "qxjoint-node-rect-active" : "qxjoint-node-rect",
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
          padding : [5, 5, active ? 2 : states.selected ? 2 : 5, 5],
          decorator: active ? "qxjoint-node-rect-caption-active" :  states.selected ? "qxjoint-node-rect-caption-active" : "qxjoint-node-rect-caption"
        };
      }
    },
    "qxjoint-node-rect/title" : "window/title",
    "qxjoint-node-rect/destroy-button" : "qxjoint-destroy-button",

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
          decorator : states.maximized ? undefined : states.active ? "qxjoint-node-rect-active" : states.selected ? "qxjoint-node-rect-active" : "qxjoint-node-rect"
        };
      }
    },

    "qxjoint-container/icon" : "window/icon",
    "qxjoint-container/captionbar" :
    {
      style : function(states)
      {
        var active = states.active && !states.disabled;
        return {
          padding : [3, 8, active ? 1 : states.selected ? 1 : 3, 8],
          textColor: active ? "highlight" : "font",
          decorator: active ? "window-caption-active" : states.selected ? "window-caption-active" : "window-caption"
        };
      }
    },

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
    "qxjoint-container/destroy-button" : "qxjoint-destroy-button",

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
          decorator : states.maximized ? undefined : states.active ? "qxjoint-node-rect-active" : states.selected ? "qxjoint-node-rect-active" : "qxjoint-node-rect"
        };
      }
    },

    "qxjoint-jnodecontainer/icon" : "window/icon",
    "qxjoint-jnodecontainer/captionbar" :
    {
      style : function(states)
      {
        var active = states.active && !states.disabled;
        return {
          padding : [5, 5, active ? 2 : states.selected ? 2 : 5, 5],
          decorator: active ? "window-caption-active" : states.selected ? "window-caption-active" : "window-caption"
        };
      }
    },

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
    "qxjoint-jnodecontainer/destroy-button" : "qxjoint-destroy-button",

    "qxjoint-resourcelink" :
    {
      style : function(states)
      {
        return {
          padding : [ 5, 5, 5, 5 ],
          decorator : "window"
        };
      }
    },

    "qxjoint-resource" : "atom",
    "qxjoint-resource/label" : "atom/label",
    "qxjoint-resource/icon" :
    {
        alias : "atom/icon",
        style : function(states)
        {
          return {
            paddingRight: 5
          };
        }
    },
    "qxjoint-resource/destroy-button" : "qxjoint-destroy-button"
  }
});
