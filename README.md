# Family Care Hospital Attock — Room Management System

A React app for private ward room management with role-based access control.

## Quick Start

Requirements: **Node.js 18+** → download from https://nodejs.org

```bash
cd hospital-app
npm install
npm run dev
```

Open http://localhost:5173

## Login

| Role      | Username    | Password       |
|-----------|-------------|----------------|
| Admin     | `admin`     | `admin123`     |
| Reception | `reception` | `reception123` |

**Admin** — full access: admit, discharge, checklist, analytics, history  
**Reception** — view only: see room status, no controls

## Features

- Room & cabin status (green = ready, red = occupied, orange = preparing)
- Admit patients with: name, MR number, contact number, date & time
- Discharge with: procedure selection (SVD/LSCS/DNC/HTX/STITCHING), date & time
- 10-item room readiness checklist after every discharge
- Patient history with full detail view, searchable by name, MR#, or contact
- Analytics dashboard with charts (Admin only)
- Mobile-friendly with slide-out sidebar

## Rooms

| Room | Type     | Floor |
|------|----------|-------|
| 201  | VIP      | 2     |
| 202  | VIP      | 2     |
| 203  | Standard | 2     |
| 204  | Standard | 2     |
| 205  | Standard | 2     |
| 206  | Semi-VIP | 2     |
| 207  | Standard | 2     |
| C1   | Cabin    | 1     |
| C2   | Cabin    | 1     |
| C3   | Cabin    | 1     |
| C4   | Cabin    | 1     |

## Cloud Storage + Deployment

See **FIREBASE_SETUP.md** for step-by-step instructions to:
- Connect to Firebase Firestore (free tier, works globally)
- Deploy to Vercel via GitHub (same workflow you already use)

---

Software by **Halik**
