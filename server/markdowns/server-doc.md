# Server Integration

Server-side code uses the Pusher-compatible HTTP API exposed by Soketi. That means your backend only needs the Soketi app credentials and the host/port of the WebSocket server.

## Pusher PHP SDK

The same idea applies in other languages: configure the SDK with the Soketi app ID, key, secret, host, and port, then publish events as usual.

```php
<?php

require __DIR__ . '/vendor/autoload.php';

use Pusher\Pusher;

$pusher = new Pusher(
    'app-key',
    'app-secret',
    'app-id',
    [
        'host' => '127.0.0.1',
        'port' => 6001,
        'scheme' => 'http',
        'encrypted' => false,
        'useTLS' => false,
    ]
);

$pusher->trigger('chat-room', 'message', [
    'sender' => 'Alice',
    'content' => 'Hi!',
]);
```

Use the following rule of thumb:

- `scheme` should be `http` for local development and `https` when Soketi is behind TLS.
- `useTLS` should be `true` only when the connection is secured end-to-end.
- `port` is usually `6001` unless you changed `SOKETI_PORT`.

## Laravel Broadcasting

Laravel broadcasting works out of the box with Soketi. The broadcasting connection just needs to point to the same host and credentials you configured in the panel.

```php
'connections' => [
    'pusher' => [
        'driver' => 'pusher',
        'key' => env('PUSHER_APP_KEY', 'app-key'),
        'secret' => env('PUSHER_APP_SECRET', 'app-secret'),
        'app_id' => env('PUSHER_APP_ID', 'app-id'),
        'options' => [
            'host' => env('PUSHER_HOST', '127.0.0.1'),
            'port' => env('PUSHER_PORT', 6001),
            'scheme' => env('PUSHER_SCHEME', 'http'),
            'encrypted' => false,
            'useTLS' => env('PUSHER_SCHEME', 'http') === 'https',
        ],
    ],
],
```

If you also use Echo on the frontend, keep the same `PUSHER_*` values there so the browser and the backend target the same Soketi instance.

## Encrypted Private Channels

Pusher encrypted private channels are supported. In this mode, the payload is encrypted before it reaches Soketi, so the server only relays encrypted data.

```php
use Pusher\Pusher;

$pusher = new Pusher('app-key', 'app-secret', 'app-id', [
    'encryptionMasterKeyBase64' => 'YOUR_MASTER_KEY',
]);
```

Generate the key once and keep it on the server only. A common way to create it is:

```bash
openssl rand -base64 32
```

## SSL Notes

When Soketi is behind HTTPS, match the client and server settings carefully: `https` on the backend, `forceTLS: true` on the client, and `wss` as the only transport.

If you use self-signed certificates, verify that your SDK version still supports the certificate handling you need. Older Pusher PHP SDK versions are sometimes required in locked-down development environments.
