# 🛠️ MENDMYTOOLS — Enterprise Repair & Cloud Support Atelier

**MendMyTools** is a cloud-native enterprise tool repair, diagnostics, and SLA ticket management platform built with **FastAPI**, **Next.js 16**, **SQLAlchemy 2.x**, and **Docker Compose**, engineered for high availability (`99.5%+ SLA`), sub-second API response times (`< 500ms P95`), and automated container crash recovery (`TTR < 32s`).

### 👥 Project by:
- **Ayushi Srivastava** — `202310101150049`
- **GitHub Repository:** [https://github.com/Cyberogh/MendMyTools](https://github.com/Cyberogh/MendMyTools)

---

## 🏛️ 1. Cloud Architecture & Pipeline Overview

```
Users / Clients ──► AWS ALB / Reverse Proxy ──► Next.js 16 Atelier UI (:3000)
                                                        │
                                                        ▼
                                                FastAPI Engine (:8000)
                                                        │
                                        ┌───────────────┴───────────────┐
                                        ▼                               ▼
                           PostgreSQL 16 / SQLite DB         AWS CloudWatch + Docker
                           (Persistent Volume Data)          Healthchecks (TTR < 32s)
```

---

## ⚡ 2. Quick Start — Local Mode (Zero-Config SQLite)

### Backend (Port 8000)
```bash
pip install fastapi "uvicorn[standard]" sqlalchemy "python-jose[cryptography]" bcrypt pydantic-settings "pydantic[email]" email-validator python-dotenv
python run_local.py
```
This automatically creates `mendmytools.db`, seeds 3 role accounts + 4 realistic enterprise repair tickets, and starts the API server at `http://127.0.0.1:8000` (Swagger UI at `/docs`).

### Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` and use the **1-Click Instant Demo Credentials** on the login screen:
- **Admin Role:** `admin@mendmytools.com` / `admin123`
- **Specialist (Agent):** `agent@mendmytools.com` / `agent123`
- **Member (Employee):** `employee@mendmytools.com` / `employee123`

---

## 🐳 3. Containerized Cloud Deployment (Docker Compose)

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
```

---

## 📊 4. Performance, SLA & TTR Benchmark Suite

With the backend running on port `8000`, execute the built-in SLA benchmark script:
```bash
python benchmark_sla.py
```
Outputs real-time **50-user concurrent load metrics (Avg, P50, P95, P99 latency, req/sec throughput, availability %)** and **Time to Recovery (TTR)** breakdown.
