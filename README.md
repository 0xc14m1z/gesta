# gesta

The goal of this package is to:

1. handle dispatched redux actions on the server;
2. dispatch back to the client redux actions;
3. locally handle actions dispatched back to the client;

This package is the server pair of the `redux-socket-dispatch` package.

## how to install

```
$ npm install --save gesta
```

## how to use it

```js
// handler.js

// we need to export the result of calling the module itself
// in order to cache it's result when we'll require this file again
// in the application
module.exports = require('gesta')()
```

```js
// handlePing.js

const { on } = require('./handler')

// handle the PING action coming from the client
on('PING', ({ dispatch }) => {
  // some stuff here...

  // dispatch the action back to redux  
  dispatch({ type: 'PONG' })
})

// handle the PONG action dispatched from the server
// this can be useful for logging or caching
on('PONG', () => {
  // some stuff here
})
```

```js
// index.js
const { register } = require('./handler')

require('./handlePing')

const socket = require('socket.io').listen(process.env.PORT)

socket.on('connection', client => {
  register('SOCKET_EVENT')(client)()
})
```

```js
// ON THE CLIENT
import openSocket from 'socket-io.client'
const socket = openSocket(process.env.ENDPOINT)

const action = { type: 'PING' }
socket.emit('SOCKET_EVENT', action)
```
