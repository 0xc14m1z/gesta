module.exports = () => {
  // map that holds handlers for application events
  const handlers = {}

  // allow the user to add handlers
  const on = (event, handler) => {
    if ( !handlers[event] ) handlers[event] = []
    handlers[event].push(handler)
  }

  // enhance the socket client listening for events
  const register = event => socket => {

    // make the actual call to an handler
    const handle = action => handler =>
      handler({ action, dispatch, broadcast })

    // dispatch an action locally
    const localDispatch = action => {
      const call = handle(action)
      const handlersForEvent = handlers[action.type] || []
      handlersForEvent.forEach(call)
    }

    // dispatch an action through the socket and locally
    const dispatch = action => {
      socket.emit(event, action)
      localDispatch(action)
    }

    // broadcast an action through all connected sockets and dispatch it locally
    const broadcast = action => {
      socket.broadcast.emit(event, action)
      localDispatch(action)
    }

    // register the listeners to the socket
    for ( const [event, handlersForEvent] of Object.entries(handlers) ) {
      for ( const handler of handlersForEvent ) {
        socket.on(event, action => handle(action)(handler))
      }
    }
  }

  return { on, register }
}
