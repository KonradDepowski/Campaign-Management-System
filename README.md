# Campaign Management System

A single-page application for managing advertising campaigns across your product catalog.

## Features

- **Products** — browse your product catalog with image cards and pricing
- **Campaigns** — create, edit, and delete advertising campaigns per product; filterable data table with status badges
- **Wallet** — live balance display; balance is automatically deducted when a campaign is created and validated before submission to prevent overspending
- **Keywords** — searchable keyword picker with badge-style tags

## Tech Stack

| Layer         | Library                                   |
| ------------- | ----------------------------------------- |
| UI            | React, Tailwind CSS, shadcn/ui (Radix UI) |
| Routing       | React Router DOM                          |
| Forms         | React Hook Form + Zod                     |
| Data fetching | TanStack React Query                      |
| Tables        | TanStack React Table                      |
| Notifications | Sonner                                    |
| Build         | Vite + TypeScript                         |

## Getting Started

```bash
npm install
npm run dev
```

The dev server proxies `/api` requests to the remote backend, so no additional configuration is needed.

---
