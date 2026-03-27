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

## 🔑 Environment Variables (Key Points)

| Variable             | Description                                    |
| :------------------- | :--------------------------------------------- |
| `BETTER_AUTH_SECRET` | Secret key for sessions.                       |
| `DB_DRIVER`          | `sqlite`, `mysql` or `pg`.                     |
| `SOKETI_HOST`        | Address of your Soketi server.                 |
| `PUSHER_APP_CLUSTER` | Cluster used for the Playground (e.g., `mt1`). |

---

## 📜 License

Distributed under the **GPL-3.0** License. See the `LICENSE` file for more information.

---

Made with ❤️ by the **Soketi Panel** community.
