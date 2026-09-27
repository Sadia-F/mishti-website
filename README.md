# Mishti & Mimi — Website

A full-stack website for **Mishti & Mimi**, with a **FastAPI** backend and a **React + TypeScript + Vite** frontend.

---

## Project Structure

```
mishti-website/
├── backend/               # FastAPI application
│   ├── main.py            # API routes, CORS, database pool
│   └── requirements.txt
└── frontend/              # React + TypeScript + Vite app
    ├── src/               # components & pages
    └── index.html
```

## Tech Stack

- **Backend:** Python, FastAPI, Pydantic, asyncpg, PostgreSQL
- **Frontend:** React 19, TypeScript, Vite
- **Linting:** Oxlint

## Getting Started

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py             # FastAPI server (with .env / DB config)
```

### Frontend

```bash
cd frontend
yarn install
yarn dev                   # Vite dev server (default http://localhost:5173)
yarn build                 # production build
```

The frontend expects the API at `localhost:5173` (dev) and is configured for the Vercel deployments listed in the backend CORS allowlist.

### Order email notifications

New order requests are stored in PostgreSQL and emailed to `ORDER_NOTIFICATION_EMAIL`. Configure these variables in the backend host's environment (for example, Render):

- `ORDER_NOTIFICATION_EMAIL=sadiaferdous003@gmail.com`
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_USERNAME=sadiaferdous003@gmail.com`
- `SMTP_PASSWORD=<Gmail app password>`
- `SMTP_FROM_EMAIL=sadiaferdous003@gmail.com` (optional; defaults to `SMTP_USERNAME`)

For Gmail, use an app password created for the sending account; never commit it to the repository. If SMTP credentials are missing or email delivery fails, the order remains saved and the form reports that notification could not be sent.
