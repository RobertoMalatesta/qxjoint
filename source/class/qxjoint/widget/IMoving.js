/**
 * Implement this interface when you want your the Paper to resize
 * on move.
 * Ofc you need to fire the event to make the resize happen.
 */
qx.Interface.define("qxjoint.widget.IMoving",
{
  events : {
    "moving": "qx.event.type.Event"
  }
});
