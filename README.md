# LifeLink - Blood Bank & Donation Management System

A full-stack blood bank and blood donation management system built with React, Next.js, Express, and MongoDB.

## Features

- **User Registration & Login** — JWT authentication with bcrypt password hashing
- **Donor Profile** — View and edit personal info, donation history
- **Donate Blood** — Record donations (admin approves to update inventory)
- **Find Blood** — Search available blood by group and city
- **Blood Requests** — Submit and track patient blood requests with urgency levels
- **Blood Inventory** — Track 8 blood groups with available/reserved units
- **Blood Camps** — Browse, register, and manage donation camps
- **Admin Dashboard** — Statistics, charts, manage donors, inventory, requests, donations, camps, and users

## Tech Stack

**Frontend:** React, TypeScript, Next.js, Tailwind CSS, shadcn/ui, Recharts  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Auth:** JWT, bcrypt

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Environment variables:**
   Copy `.env.example` to `.env` and update values:
   ```bash
   cp .env.example .env
   ```
   The server uses its own `.env` inside the `server/` directory:
   ```bash
   cd server
   cp .env.example .env
   cd ..
   ```

4. **Run the backend:**
   ```bash
   cd server
   npm run dev
   ```
   The server runs on `http://localhost:5000` and auto-seeds initial data (admin user, blood inventory, camps).

5. **Run the frontend** (in a separate terminal):
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:3000`.

## Default Admin Account

- **Email:** admin@lifelink.com
- **Password:** admin123

The admin account is auto-created on first server startup.

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new donor
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Donors
- `GET /api/donors` — Get own donor profile
- `PUT /api/donors` — Update own donor profile

### Blood Inventory
- `GET /api/blood` — Get all blood inventory
- `GET /api/blood/:group` — Get specific blood group
- `PUT /api/blood/:group` — Update inventory (admin)

### Donations
- `POST /api/donations` — Create donation record
- `GET /api/donations` — Get donations
- `PUT /api/donations/:id/status` — Approve/reject donation (admin)

### Blood Requests
- `POST /api/requests` — Create blood request
- `GET /api/requests` — Get blood requests
- `PUT /api/requests/:id/status` — Update request status (admin)

### Blood Camps
- `GET /api/camps` — List camps
- `POST /api/camps` — Create camp (admin)
- `PUT /api/camps/:id` — Update camp (admin)
- `DELETE /api/camps/:id` — Delete camp (admin)
- `POST /api/camps/:id/register` — Register for camp

### Admin
- `GET /api/admin/dashboard` — Dashboard statistics
- `GET /api/admin/users` — All users
- `GET /api/admin/donors` — All donors
- `GET /api/admin/requests` — All requests
- `GET /api/admin/donations` — All donations
- `GET /api/admin/camps` — All camps
- `PUT /api/admin/donors/:id` — Update donor

## Project Structure

```
├── app/                    # Next.js app directory (pages)
│   ├── admin/              # Admin pages
│   ├── about/
│   ├── camps/
│   ├── donate/
│   ├── find-blood/
│   ├── login/
│   ├── profile/
│   ├── register/
│   └── request-blood/
├── components/             # Shared React components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Frontend utilities
│   ├── context/            # Auth context
│   ├── api.ts              # API service
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Helpers
└── server/                 # Express backend
    ├── config/             # Database config
    ├── middleware/         # Auth & error middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    └── services/           # Seed service
```
