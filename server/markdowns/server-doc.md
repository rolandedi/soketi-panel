## Pusher SDK

The backend configuration of your real-time messaging infrastructure will depend on the language of your application. However, in this example we will demonstrate configuration the Pusher PHP SDK to interact with soketi, which should be similar to the configuration of server-side Pusher SDKs in other languages:

```php
<?php

require __DIR__ . '/vendor/autoload.php';

$pusher = new Pusher\Pusher('app-key', 'app-secret', 'app-id', [
    'host' => 'localhost',
    'port' => 6081,
    'scheme' => 'http',
    'encrypted' => false,
    'useTLS' => true,
    'options' => [
        CURLOPT_SSLVERSION => CURL_SSLVERSION_TLSv1_2,
    ],
]);

$pusher->trigger('chat-room', 'message', ['sender' => 'Alice', 'content' => 'Hi!']);
```

### Encrypted Private Channels

[Pusher Encrypted Private Channels](https://pusher.com/docs/channels/using_channels/encrypted-channels/) are also supported, meaning that for private channels, you can encrypt your data symmetrically at both your client and backend applications, soketi NOT knowing at all what the actual data is set, acting just like a deliverer.

```php
use Pusher\Pusher;

$pusher = new Pusher('app-key', 'app-secret', 'app-id', [
    'encryptionMasterKeyBase64' => 'YOUR_MASTER_KEY',  // generate this with, e.g. 'openssl rand -base64 32'
]);
```

## Laravel Broadcasting

When using [Laravel's event broadcasting](https://laravel.com/docs/10.x/broadcasting) feature within your application, soketi is even easier to configure. First, replace the default `pusher` configuration in your application's `config/broadcasting.php` file with the following configuration:

```php
'connections' => [
    'pusher' => [
        'driver' => 'pusher',
        'key' => env('PUSHER_APP_KEY', 'app-key'),
        'secret' => env('PUSHER_APP_SECRET', 'app-secret'),
        'app_id' => env('PUSHER_APP_ID', 'app-id'),
        'options' => [
            'host' => env('PUSHER_HOST', 'localhost'),
            'port' => env('PUSHER_PORT', 6081),
            'scheme' => env('PUSHER_SCHEME', 'http'),
            'encrypted' => true,
            'useTLS' => env('PUSHER_SCHEME') === 'https',
        ],
    ],
],
```

> To configure the client for [SSL](https://docs.soketi.app/getting-started/ssl-configuration), you should set the `scheme` option to `http` and the `useTLS` option to true.

### Self-signed Certificates

Due to implementation changes in the Pusher PHP SDK, releases of the SDK since the `6.0` release do not support `curl_options`; therefore, self-signed SSL certificates will fail certificate validation since certificate verification cannot be disabled. To bypass SSL Verification, you must use Pusher PHP SDK version `5.0.3`.
