## Pusher SDK

Pusher clients are fully compatible with the WebSocket protocol implemented by soketi, which means you can easily take advantage of amazing features like private channels, presence channels, and client events. You simply need to point the Pusher compatible client to the soketi server address:

```javascript
const PusherJS = require('pusher-js');

let client = new PusherJS('app-key', {
    wsHost: 'localhost',
    wsPort: 6081,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
});

client.subscribe('chat-room').bind('message', (message) => {
    alert(`${message.sender} says: ${message.content}`);
});
```

> Make sure that enabledTransports is set to ['ws', 'wss']. If not set, in case of connection failure, the client will try other transports such as XHR polling, which soketi doesn't support.

### SSL Configuration

When running the server in SSL mode, you may consider setting the `forceTLS` client option to `true`. When this option is set to `true`, the client will connect to the `wss` protocol instead of `ws`:

```javascript
const PusherJS = require('pusher-js');

let client = new PusherJS('app-key', {
    wssHost: 'localhost',
    wssPort: 6081,
    forceTLS: true,
    enabledTransports: ['wss'],
});
```

### Encrypted Private Channels

[Pusher Encrypted Private Channels](https://pusher.com/docs/channels/using_channels/encrypted-channels/) are also supported, meaning that for private channels, you can encrypt your data symmetrically at both your client and backend applications, soketi NOT knowing at all what the actual data is set, acting just like a deliverer.

## Laravel Echo

Laravel Echo is compatible with the PusherJS library. Therefore, its configuration resembles the typical configuration of a PusherJS client such as the example configuration in the previous section of documentation:

```javascript
import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');

let laravelEcho = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    wsHost: process.env.MIX_PUSHER_HOST,
    wsPort: process.env.MIX_PUSHER_PORT,
    wssPort: process.env.MIX_PUSHER_PORT,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
});

laravelEcho.private(`orders.${orderId}`)
    .listen('OrderShipmentStatusUpdated', (e) => {
        console.log(e.order);
    });
```

> Make sure that enabledTransports is set to ['ws', 'wss']. If not set, in case of connection failure, the client will try other transports such as XHR polling, which soketi doesn't support.

The `MIX_*` environment variables are typically declared in your Laravel application's `.env` file:

```bash
PUSHER_APP_KEY=app-key
PUSHER_APP_ID=app-id
PUSHER_APP_SECRET=app-secret
PUSHER_HOST=localhost
PUSHER_PORT=6081

MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_HOST="${PUSHER_HOST}"
MIX_PUSHER_PORT="${PUSHER_PORT}"
```
