# Saathi Sanga Manko Kura - Backend

**Anonymous Audio Peer Support Network Backend for Mental Health in Nepal**

---

## Overview
This backend powers the “Saathi Sanga Manko Kura” platform, connecting users to **Community Mental Health Volunteers (CMHVs)** via **anonymous audio group chats**. It handles **authentication, session management, live audio integration, feedback, and analytics**.  

---

## Tech Stack
- **Backend:** Node.js + Express  
- **Database:** Supabase / Firebase / PostgreSQL  
- **Audio Integration:** WhatsApp API / Telegram API / WebRTC (custom option)  
- **Hosting:** Vercel / Render / Railway (MVP deployment)  

---

## Backend Modules

### 1. Authentication Module
- Handles **user and CMHV signup/login**.  
- Assigns **nickname or unique ID** for anonymity.  
- **Endpoints:**
  - POST `/signup`
  - POST `/login`
  - GET `/logout`
- **Data Stored:** ID, nickname, category preference, language, CMHV training status

### 2. Session Module
- Manages **peer group sessions**: create, edit, delete, assign CMHVs.  
- Tracks session timing and participant lists.  
- **Endpoints:**
  - GET `/sessions`
  - POST `/sessions`
  - PUT `/sessions/:id`
  - DELETE `/sessions/:id`
- **Data Stored:** Session ID, category, language, scheduled time, assigned CMHVs, participants

### 3. Messaging / Audio Service
- Connects users to **WhatsApp/Telegram/WebRTC** audio sessions.  
- Handles **join/leave events** and **private messages** to CMHVs.  
- **Endpoints:**
  - POST `/join-session`
  - POST `/leave-session`
  - POST `/private-message`
- **Data Stored:** Live participant lists, optional temporary session logs

### 4. Feedback Module
- Collects **session ratings and notes** from users.  
- **Endpoints:**
  - POST `/feedback`
  - GET `/feedback/:sessionId`
- **Data Stored:** Feedback ID, session ID, user ID, rating, notes, timestamp

### 5. Volunteer & Session Management Module
- Enables CMHVs to **view/manage sessions**, moderate live participants, and submit reports.  
- **Endpoints:**
  - GET `/cmhv/sessions`
  - POST `/cmhv/report`
  - PUT `/cmhv/session/:id`
- **Data Stored:** Session reports, CMHV activity logs

### 6. Admin & Analytics Module
- Admin can **monitor users, sessions, volunteer activities**, and upload training materials.  
- Aggregates feedback for **analytics dashboards**.  
- **Endpoints:**
  - GET `/admin/users`
  - GET `/admin/sessions`
  - GET `/admin/analytics`
  - POST `/admin/training`
- **Data Stored:** Aggregated session stats, volunteer logs, training materials

---

## Data Flow
