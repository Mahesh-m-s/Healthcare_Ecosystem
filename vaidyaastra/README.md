# VaidyaAstra: AI-Powered Healthcare Ecosystem

VaidyaAstra is a futuristic, AI-first healthcare operating system that connects patients, doctors, hospitals, pharmacies, insurance systems, and emergency care into one unified ecosystem. 

## Features

- **Patient Domain:** OTP login, Secure Health Records, AI Report Assistant, Video Consultation, Health Timeline Dashboard.
- **Doctor Domain:** Smart Patient Summary, Queue Dashboard, Video Consultations, AI Prescription Assistant.
- **Management Domain:** Live Bed Availability, Pharmacy Inventory, Emergency Prioritization Engine.
- **AI Integration:** OpenAI/Gemini powered report summaries, intelligent queuing, triage detection.
- **Security:** End-to-end encryption, HIPAA-compliant structure, Role-based Access Control.

## Architecture

This project is structured as a monorepo containing multiple microservices:
- `/frontend`: Next.js 15 app with Tailwind CSS, shadcn/ui, Framer Motion (Glassmorphism design).
- `/backend-node`: Express.js backend handling Core APIs and Socket.IO for real-time queueing.
- `/backend-ai`: FastAPI microservice handling LLM interactions (OpenAI/Gemini).

## Quick Start

### 1. Start Node.js Backend
```bash
cd backend-node
npm run dev
```

### 2. Start AI Backend (FastAPI)
```bash
cd backend-ai
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Start Next.js Frontend
```bash
cd frontend
npm run dev
```
