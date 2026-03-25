# Soketi Panel

Simple frontend for [Soketi](https://soketi.app/) websocket server with a intuitive user interface. Made with [Nuxt](https://nuxt.com/) and 💕

**Soketi Panel** provides a user-friendly interface for managing your Soketi websocket applications. You can effortlessly manage multiple websocket applications, streamlining your app management process. The whole setup process is made simpler so that anyone can easily get started with the Soketi websocket server.

## Setup

Make sure to install dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm build
```

Locally preview production build:

```bash
# pnpm
pnpm preview
```

## Génération des clés

```bash
openssl rand -hex 16   # APP_ID
openssl rand -hex 32   # APP_KEY
openssl rand -hex 64   # APP_SECRET
```

## License

Under GPL-3.0 License
