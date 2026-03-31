# Client Integration

Soketi speaks the Pusher protocol, so any Pusher-compatible browser client can connect to it. The important part is to point the client to your Soketi host and keep WebSocket transports enabled.

## Pusher JS

Use the Soketi host and port configured in your panel or `.env` file:

```javascript
import Pusher from "pusher-js";

const client = new Pusher("app-key", {
  wsHost: "127.0.0.1",
  wsPort: 6001,
  wssHost: "127.0.0.1",
  wssPort: 6001,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

client.subscribe("chat-room").bind("message", (message) => {
  console.log(`${message.sender} says: ${message.content}`);
});
```

The key settings are:

- `wsHost` and `wsPort`: use these for plain WebSocket connections.
- `wssHost` and `wssPort`: use these when Soketi is exposed over TLS.
- `forceTLS`: set this to `true` when your app is served over HTTPS.
- `enabledTransports`: keep this limited to `ws` and `wss`. Soketi does not support fallback transports such as XHR polling.
- `disableStats`: safe to keep enabled in local and self-hosted setups.

## Secure Connections

When Soketi is behind HTTPS or a TLS terminator, switch the client to secure WebSockets:

```javascript
import Pusher from "pusher-js";

const client = new Pusher("app-key", {
  wssHost: "soketi.example.com",
  wssPort: 6001,
  forceTLS: true,
  disableStats: true,
  enabledTransports: ["wss"],
});
```

## Private and Presence Channels

Private and presence channels work the same way as with the hosted Pusher service. Your client still subscribes with the usual channel names, but the authorization endpoint must be available in your backend.

```javascript
client.subscribe("private-orders.42");
client.subscribe("presence-orders.42");
```

If you use encrypted private channels, the payload is encrypted by your application and never interpreted by Soketi itself.

## Laravel Echo

Laravel Echo is just a thin wrapper around a Pusher-compatible client, so the same Soketi settings apply:

```javascript
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "app-key",
  wsHost: "127.0.0.1",
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

echo
  .private(`orders.${orderId}`)
  .listen("OrderShipmentStatusUpdated", (event) => {
    console.log(event.order);
  });
```

In practice, you usually mirror these values in environment variables so the same config can be reused across local, staging, and production deployments.
