# Project X - Live Cricket Platform (MVP)

A production-ready, API-first web platform delivering **live cricket scores, match schedules, and detailed match insights**, built with reliability, clean architecture, and scalability in mind.

> **Phase 1 goal**: Ship a fast, stable MVP suitable for investor demos and early users, while keeping the backend extensible for long-term growth.

---

## Features (Phase 1)

### Live Scores

* Real-time match updates (polling-based)
* Clean match cards with score, overs, run rate, and status
* Auto-refresh without manual reload

### Match Schedule

* Upcoming fixtures
* UTC-based timestamps (frontend converts to US timezones)
* Filters by team, tournament, and date

### Match Detail Page

* Ball-by-ball commentary (current innings)
* Live batsman & bowler statistics
* Full scorecard

### User Engagement

* Email waitlist signup (name + email)
* Social sharing (frontend)
* “Discuss” UI (frontend mock only)

### Deployment

* Live backend deployed on **Vercel**
* Clean, modular, production-grade codebase

---

## Architecture Overview

This project follows a **decoupled, API-first architecture**.

```
Frontend (Next.js / React)
        ↓
REST API (FastAPI)
        ↓
Service Layer
        ↓
Domain Models
        ↓
Infrastructure
(PostgreSQL | Redis | External Cricket API)
```

### Why this architecture?

* Enables parallel frontend and backend development
* Clean separation of concerns
* Investor-ready and scalable
* Easy to evolve into mobile apps or additional clients

---

## Tech Stack

### Backend

* **Language**: Python 3.11
* **Framework**: FastAPI
* **Database**: PostgreSQL
* **Cache**: Redis
* **ORM**: SQLAlchemy 2.0
* **Migrations**: Alembic
* **HTTP Client**: httpx (async)
* **Deployment**: Vercel (Serverless)
* **Logging**: Python logging (basic)

### Frontend (separate repo)

* React / Next.js
* API-driven (no backend rendering)

---

## Backend Responsibilities

The backend:

* Polls third-party cricket data providers
* Normalizes and caches live match data
* Exposes stable REST APIs
* Stores user email signups
* Handles failures gracefully

The backend **does not**:

* Render UI
* Manage real comments (Phase 1)
* Push WebSocket updates (polling only)
* Permanently store historical ball-by-ball data

---

## Live Data Flow

```
Scheduler (Polling)
   ↓
External Cricket API
   ↓
Normalization Layer
   ↓
Redis Cache (Live Match State)
   ↓
REST APIs
   ↓
Frontend
```

* Polling interval: ~30–45 seconds
* Redis protects against API rate limits
* PostgreSQL stores only persistent data (emails, metadata)

---

## Project Structure

```
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   └── routes/
│   │       ├── matches.py
│   │       ├── engagement.py
│   │       └── health.py
│   │
│   ├── services/
│   │   ├── polling_service.py
│   │   ├── match_service.py
│   │   └── email_service.py
│   │
│   ├── domain/
│   │   ├── match.py
│   │   └── score.py
│   │
│   ├── infrastructure/
│   │   ├── db.py
│   │   ├── redis.py
│   │   └── external_api.py
│   │
│   ├── models/
│   │   └── email.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   └── logging.py
│   │
│   └── tests/
│       ├── test_matches.py
│       └── test_email.py
│
├── alembic/
└── requirements.txt
```

---

## API Overview

Base path:

```
/api/v1
```

### Live Matches

```
GET /matches/live
```

### Match Schedule

```
GET /matches/schedule
```

### Match Detail

```
GET /matches/{match_id}
```

### Email Signup

```
POST /engagement/email
```

Payload:

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Health Check

```
GET /health
```

---

## Testing Strategy

Phase-1 testing focuses on **critical reliability paths**:

* Email signup validation
* Match API response structure
* Redis cache fallback logic

Advanced testing (load, E2E) is planned post-MVP.

---

## Environment Setup

### Environment Variables

```
DATABASE_URL=
REDIS_URL=
EXTERNAL_API_KEY=
```

* All timestamps are stored in **UTC**
* Frontend handles timezone conversion (EST / PST / CST)

---

## Deployment

* Backend deployed as a **serverless FastAPI app on Vercel**
* Managed PostgreSQL & Redis
* Separate **dev** and **prod** environments

---

## Roadmap (Post-MVP)

* WebSocket-based real-time updates
* User accounts & personalization
* Push notifications
* Mobile app clients
* Analytics & insights
* Paid subscription tiers

---

## Ownership & Contribution

* Phase 1 maintained by a single backend engineer
* Codebase structured for easy onboarding
* Contributions welcome after MVP stabilization

---

## References

* **FastAPI Documentation** - Sebastián Ramírez
  [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)

* **SQLAlchemy 2.0 ORM Guide** - SQLAlchemy Project
  [https://docs.sqlalchemy.org/en/20/](https://docs.sqlalchemy.org/en/20/)

* **Redis Caching Patterns** - Redis Ltd.
  [https://redis.io/docs/latest/develop/use-cases/](https://redis.io/docs/latest/develop/use-cases/)

* **The Twelve-Factor App** - Heroku
  [https://12factor.net/](https://12factor.net/)
