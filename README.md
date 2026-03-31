# Soketi Panel 🚀

[![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-FF4500?style=for-the-badge&logo=auth0&logoColor=white)](https://better-auth.com/)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue.svg?style=for-the-badge)](LICENSE)

**Soketi Panel** is a modern and intuitive administration interface for the [Soketi](https://soketi.app/) WebSocket server. Manage your applications, monitor connections, and test events in real-time with elegance.

---

## ✨ Features

- 🔐 **Robust Authentication**: Powered by Better Auth with administrator role management.
- 📱 **Application Management**: Create, edit, and delete your Soketi applications with secure key generation.
- 🎮 **WebSocket Playground**: Interactive console to test connections, subscribe to channels, and emit events.
- 📊 **Dashboard**: Overview of your statistics and active applications.
- 📚 **In-App Docs**: Quick guides for configuring your WebSocket clients and servers.
- 🎨 **Modern UI**: Clean design with Tailwind CSS v4, Shadcn Vue, and dark mode support.

## 🚀 Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3.5+, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn Vue](https://www.shadcn-vue.com/)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **Database**: [Knex.js](https://knexjs.org/) (Migrations & Seeds)
- **Validation**: [Zod](https://zod.dev/) & [Vee-Validate](https://vee-validate.logaretm.com/v4/)
- **Table**: [TanStack Table](https://tanstack.com/table/v8)

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/votre-repo/soketi-panel.git
cd soketi-panel
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

Copy the example file and fill in the required variables:

```bash
cp .env.example .env
```

_Generate your secrets for authentication:_

```bash
openssl rand -hex 32 # For BETTER_AUTH_SECRET
```

### 4. Database & Migrations

Prepare your database (SQLite by default or configure MySQL/PG in `.env`):

```bash
pnpm migrate        # Run migrations
pnpm seed           # (Optional) Add test data / Default admin
```

---

## 🛠️ Development

Run the development server:

```bash
pnpm dev
```

Access the interface at `http://localhost:3000`.

### Useful Commands

- `pnpm build`: Build for production.
- `pnpm preview`: Local preview of the production build.
- `pnpm migrate:make <name>`: Create a new migration.
- `pnpm seed:make <name>`: Create a new seed.

---

## 🔑 Environment Variables

| Variable                      | Description                                                     | Default                      |
| :---------------------------- | :-------------------------------------------------------------- | :--------------------------- |
| **App**                       |                                                                 |                              |
| `APP_NAME`                    | Name of the application (e.g., "Soketi Panel").                 | `"Soketi Panel"`             |
| `APP_ENV`                     | Application environment (`production`, `development`).          | `"production"`               |
| `APP_URL`                     | Canonical URL of the application.                               | `http://localhost:3000`      |
| **Better Auth**               |                                                                 |                              |
| `BETTER_AUTH_SECRET`          | Secret key for sessions (Generate with `openssl rand -hex 32`). | **Required**                 |
| `BETTER_AUTH_URL`             | Public URL of the authentication server.                        | `http://localhost:3000`      |
| **Database**                  |                                                                 |                              |
| `DB_DRIVER`                   | Database driver (`mysql`, `pg`, `sqlite`).                      | `"mysql"`                    |
| `DB_HOST`                     | Host of the database for the panel.                             | `"localhost"`                |
| `DB_PORT`                     | Port of the database for the panel.                             | `3306` (MySQL) / `5432` (PG) |
| `DB_DATABASE`                 | Database name for the panel.                                    | `"soketi_db"`                |
| `DB_USERNAME`                 | Username for the database.                                      | `"soketi"`                   |
| `DB_PASSWORD`                 | Password for the database.                                      | `""`                         |
| **Soketi (Management)**       |                                                                 |                              |
| `SOKETI_HOST`                 | Hostname of the Soketi server.                                  | `"127.0.0.1"`                |
| `SOKETI_PORT`                 | Port of the Soketi server.                                      | `6001`                       |
| `SOKETI_METRICS_HOST`         | Hostname for Soketi Prometheus metrics.                         | `"127.0.0.1"`                |
| `SOKETI_METRICS_PORT`         | Port for Soketi Prometheus metrics.                             | `9601`                       |
| **Soketi (Database Backend)** |                                                                 |                              |
| `SOKETI_DB_HOST`              | Host of the database Soketi uses.                               | Same as `DB_HOST`            |
| `SOKETI_DB_DATABASE`          | Database Soketi uses for app management.                        | Same as `DB_DATABASE`        |
| **Playground (Pusher)**       |                                                                 |                              |
| `PUSHER_APP_CLUSTER`          | Cluster name for playground connection.                         | `"mt1"`                      |
| `PUSHER_HOST`                 | WebSocket host for playground.                                  | `SOKETI_HOST`                |
| `PUSHER_PORT`                 | WebSocket port for playground.                                  | `SOKETI_PORT`                |
| `PUSHER_SCHEME`               | Connection scheme (`http` or `https`).                          | `"http"`                     |
| `PUSHER_TLS`                  | Enable TLS for playground (`0` or `1`).                         | `0`                          |

---

## 📜 License

Distributed under the **GPL-3.0** License. See the `LICENSE` file for more information.

---

Made with ❤️ by the **Soketi Panel** community.
