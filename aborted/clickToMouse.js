// let $;

// function touchEventToMouseEvent(event, eventType) {

//   if (!event.originalEvent || !event.originalEvent.targetTouches || event.originalEvent.targetTouches.length !== 1)

//     return false;

//   var te = event.originalEvent.targetTouches[0];

//   var clientX = te.clientX, clientY = te.clientY, screenX = te.screenX, screenY = te.screenY;

//   var simEvent = new MouseEvent(eventType, {

//     clientX: clientX,

//     clientY: clientY,

//     screenX: screenX,

//     screenY: screenY,

//     button: 0,

//     buttons: 0

//   });

//   return simEvent;

// }

// function findElm(targetElement) {

//   targetElement.on('touchstart', function (e) {

//     console.log('touchstart');

//     console.log(e);

//     var simEvent = touchEventToMouseEvent(e, 'mousedown');

//     if (simEvent != null) {

//       $(this)[0].dispatchEvent(simEvent);

//     }

//   });

//   targetElement.on('touchmove', function (e) {

//     e.preventDefault();

//     console.log('touchmove');

//     var simEvent = touchEventToMouseEvent(e, 'mousemove');

//     if (simEvent != null) {

//       $(this)[0].dispatchEvent(simEvent);

//     }

//   });

//   targetElement.on('touchend', function (e) {

//     console.log('touchend');

//     console.log(e);

//     var simEvent = touchEventToMouseEvent(e, 'mouseup');

//     if (simEvent != null) {

//       $(this)[0].dispatchEvent(simEvent);

//     }

//   });

// }