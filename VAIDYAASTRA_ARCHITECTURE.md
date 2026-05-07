# 🏥 VAIDYAASTRA — Master Foundation Architecture
## "AI-Powered Universal Healthcare Operating System"
### Version 1.0 | Foundation Blueprint

---

## TABLE OF CONTENTS

1. [System Overview](#1-system-overview)
2. [Three-User Ecosystem Model](#2-three-user-ecosystem-model)
3. [Patient Workflow Architecture](#3-patient-workflow-architecture)
4. [Hospital Management Workflow Architecture](#4-hospital-management-workflow-architecture)
5. [Doctor Workflow Architecture](#5-doctor-workflow-architecture)
6. [Emergency Workflow Architecture](#6-emergency-workflow-architecture)
7. [AI Systems Architecture](#7-ai-systems-architecture)
8. [Google Maps Integration Architecture](#8-google-maps-integration-architecture)
9. [Backend Architecture (FastAPI + Python)](#9-backend-architecture)
10. [Frontend Architecture (React + TypeScript)](#10-frontend-architecture)
11. [Database Design](#11-database-design)
12. [File Upload Architecture](#12-file-upload-architecture)
13. [Role-Based Security Architecture](#13-role-based-security-architecture)
14. [API Communication Architecture](#14-api-communication-architecture)
15. [Environment Variables Structure](#15-environment-variables-structure)
16. [Complete Folder Structure](#16-complete-folder-structure)
17. [Data Flow Diagrams](#17-data-flow-diagrams)
18. [Deployment Foundation](#18-deployment-foundation)
19. [Completion Summary & Next Prompt](#19-completion-summary--next-prompt)

---

## 1. SYSTEM OVERVIEW

### Platform Identity

```
VaidyaAstra
├── Name Origin: "Vaidya" (Sanskrit: Physician/Healer) + "Astra" (Sanskrit: Weapon/Tool)
├── Mission:     AI-Powered Universal Healthcare Operating System
├── Scale:       Enterprise-grade, multi-tenant, pan-India + globally scalable
└── Core Belief: Every patient deserves AI-grade medical intelligence
```

### What VaidyaAstra Solves

| Problem | VaidyaAstra Solution |
|---|---|
| Fragmented medical records | Unified AI Medical Vault |
| Language barriers in healthcare | Multilingual AI report explanations |
| Emergency coordination chaos | Automated 360° Emergency System |
| Doctor-patient data gap | Secure bidirectional medical data flows |
| Insurance complexity | AI Insurance Advisor |
| Delayed ambulance coordination | Real-time ambulance + GPS tracking |
| Unread/misunderstood reports | AI medical report analyzer |
| Hospital bed availability unknown | Live bed management dashboard |

### Platform Architecture Type

```
Microservices-oriented Monorepo
├── Single codebase, clearly separated concerns
├── Frontend: React SPA (Single Page Application)
├── Backend: FastAPI Python REST + WebSocket server
├── Database: SQLite (relational) + MongoDB (documents/files metadata)
├── Storage: Local filesystem (dev) → Cloud Object Storage (prod)
├── AI: Google Gemini 2.0 Flash / 1.5 Pro APIs
└── Maps: Google Maps JavaScript API + Places API + Directions API
```

---

## 2. THREE-USER ECOSYSTEM MODEL

### User Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                     VAIDYAASTRA                         │
│                                                         │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────┐  │
│  │   PATIENT   │  │ HOSPITAL MGMT    │  │  DOCTOR   │  │
│  │  Self-reg.  │  │ Platform-created │  │ Hospital- │  │
│  │  accounts   │  │ admin accounts   │  │ created   │  │
│  └──────┬──────┘  └────────┬─────────┘  └─────┬─────┘  │
│         │                  │                   │        │
│         └──────────────────┼───────────────────┘        │
│                            │                            │
│                    SECURE DATA LAYER                    │
│                 (JWT + RBAC + Encryption)               │
└─────────────────────────────────────────────────────────┘
```

### Role Definitions

```yaml
PATIENT:
  registration: "Self-registration via public signup"
  verification: "Email/Phone OTP verification"
  scope:
    - Manage own medical vault
    - Upload & view own reports
    - Book appointments, beds, ambulance
    - Access AI analysis of own records
    - Emergency SOS trigger
  data_access: "Own records only"
  created_by: "Self"

HOSPITAL_MANAGEMENT:
  registration: "Platform admin onboards hospitals"
  verification: "Organization verification + admin approval"
  scope:
    - Manage entire hospital entity
    - Create doctor accounts under hospital
    - View all patients admitted to hospital
    - Manage beds, ICU, OT, departments
    - Receive emergency alerts
    - View AI triage reports
    - Insurance verification portal
  data_access: "All patients currently/previously in their hospital"
  created_by: "VaidyaAstra Platform Admin"

DOCTOR:
  registration: "Created by Hospital Management only"
  verification: "Hospital assigns credentials"
  scope:
    - View assigned patient records
    - Add diagnosis, prescriptions, SOAP notes
    - Receive emergency case alerts
    - Access AI assistant for patient summaries
    - Generate and send reports to patients
    - View scan uploads with AI overlay
  data_access: "Patients assigned by hospital to this doctor"
  created_by: "Hospital Management"
```

---

## 3. PATIENT WORKFLOW ARCHITECTURE

### 3.1 Registration & Authentication Flow

```
[Public Signup Page]
    │
    ├── Enter: Name, DOB, Phone, Email, Password, Blood Group, Allergies
    │
    ├── OTP Verification (Phone/Email)
    │
    ├── Profile Creation → Patient UUID assigned
    │
    ├── JWT Token issued (access: 1hr, refresh: 7 days)
    │
    └── Redirect → Patient Dashboard
```

### 3.2 Patient Dashboard Modules

```
PATIENT DASHBOARD
│
├── 🏠 Home Overview
│   ├── Greeting with name + blood group badge
│   ├── Quick health score (AI-generated)
│   ├── Upcoming appointments
│   └── Pending AI analyses
│
├── 📁 Medical Vault
│   ├── Upload Section
│   │   ├── MRI Scans (.dcm, .jpg, .png, .pdf)
│   │   ├── CT Scans (.dcm, .jpg, .pdf)
│   │   ├── Blood Reports (.pdf, .jpg, .png)
│   │   ├── Prescriptions (.pdf, .jpg)
│   │   ├── ECG Reports (.pdf, .jpg)
│   │   ├── X-Ray Images (.jpg, .png, .dcm)
│   │   └── Discharge Summaries (.pdf)
│   │
│   ├── AI Analysis View
│   │   ├── Plain-language explanation
│   │   ├── Risk level badge (Low/Medium/High/Critical)
│   │   ├── Specialist recommendation
│   │   ├── Language selector (regional translation)
│   │   └── Export AI report as PDF
│   │
│   └── History Timeline
│       ├── Chronological medical events
│       ├── Doctor interactions log
│       └── Hospital visit history
│
├── 🤖 AI Symptom Checker
│   ├── Natural language symptom input
│   ├── Body map selector (clickable anatomy diagram)
│   ├── Duration, severity inputs
│   ├── AI generates possible conditions
│   ├── Emergency risk assessment
│   └── "Book Doctor Now" shortcut
│
├── 🚨 Emergency System
│   ├── Big red SOS button (always visible)
│   ├── Auto-detect location via GPS
│   ├── Nearby hospitals (Google Maps)
│   ├── Live ambulance booking
│   ├── Auto-send patient history to hospital
│   ├── Family emergency contact alerts
│   └── Real-time tracking share link
│
├── 🏥 Hospital Services
│   ├── Nearby Hospitals Map
│   ├── Bed Availability Checker
│   ├── OPD Appointment Booking
│   ├── ICU/Ward Admission Request
│   └── Hospital Rating & Reviews
│
├── 👨‍⚕️ Doctor Booking
│   ├── Search by specialty / name / hospital
│   ├── Doctor availability calendar
│   ├── Video / In-person toggle
│   ├── Booking confirmation + reminders
│   └── Pre-consultation AI brief auto-sent to doctor
│
├── 💳 Insurance AI Advisor
│   ├── Upload insurance card / policy document
│   ├── AI extracts coverage terms
│   ├── Coverage check against current condition
│   ├── Claim filing guide
│   └── Hospital network finder for insurer
│
├── 👨‍👩‍👧 Family & Emergency Contacts
│   ├── Add up to 5 emergency contacts
│   ├── Define alert hierarchy
│   ├── Shared health summary (consent-based)
│   └── Emergency broadcast settings
│
└── ⚙️ Account Settings
    ├── Profile management
    ├── Privacy controls
    ├── Notification preferences
    └── Language preference (UI + AI reports)
```

### 3.3 Patient → AI Report Analysis Flow

```
Patient uploads file
        │
        ▼
[File Validation Service]
  ├── Type check (MIME type)
  ├── Size check (max 50MB per file)
  ├── Virus scan placeholder (ClamAV hook)
  └── Assign file UUID + timestamp
        │
        ▼
[File Storage Service]
  ├── Store in /storage/patients/{patient_uuid}/reports/
  ├── Generate signed access URL
  └── Save metadata to MongoDB
        │
        ▼
[AI Analysis Queue]
  ├── Task queued in background worker
  ├── Priority: CRITICAL > HIGH > NORMAL
  └── Worker picks up task
        │
        ▼
[Gemini AI Service]
  ├── Extract text from PDF / analyze image
  ├── Identify report type (MRI, Blood, ECG, etc.)
  ├── Generate structured medical analysis
  ├── Assign risk level
  ├── Generate plain-language explanation
  ├── Suggest specialist type
  └── Detect emergency indicators
        │
        ▼
[Translation Service]
  ├── Detect patient's preferred language
  ├── Translate analysis using Gemini
  └── Store both English + regional versions
        │
        ▼
[Emergency Check]
  ├── If CRITICAL risk detected:
  │   ├── Trigger emergency notification flow
  │   ├── Alert patient immediately
  │   └── Prepare emergency data packet
  └── If NOT critical:
      └── Store result, notify patient via push/email
        │
        ▼
[Patient Dashboard Update]
  └── Analysis appears in Medical Vault with full report
```

---

## 4. HOSPITAL MANAGEMENT WORKFLOW ARCHITECTURE

### 4.1 Hospital Onboarding

```
[VaidyaAstra Platform Admin]
        │
        ├── Creates Hospital Entity
        │   ├── Hospital name, address, license number
        │   ├── Specialties offered
        │   ├── Total beds, ICU beds, OT count
        │   ├── Emergency services Y/N
        │   └── GPS coordinates (for emergency routing)
        │
        ├── Creates Hospital Admin Account
        │   ├── Admin name, email, phone
        │   └── Temporary password (force reset on login)
        │
        └── Hospital receives login credentials via email
```

### 4.2 Hospital Management Dashboard Modules

```
HOSPITAL MANAGEMENT DASHBOARD
│
├── 🏥 Hospital Overview
│   ├── Live bed occupancy (visual floor map)
│   ├── Active patients count
│   ├── Emergency alerts feed
│   ├── Today's admissions
│   └── Department-wise status
│
├── 🚨 Emergency Alert Center
│   ├── Real-time emergency incoming alerts
│   ├── Patient details preview (AI summary)
│   ├── Ambulance ETA (Google Maps)
│   ├── Accept / Redirect controls
│   ├── Auto-assign to emergency department
│   └── One-click doctor assignment
│
├── 🛏 Bed Management System
│   ├── Ward-wise bed map
│   ├── ICU bed status (available / occupied / reserved)
│   ├── OT scheduling
│   ├── Discharge management
│   └── Bed request approval queue
│
├── 👨‍⚕️ Doctor Management
│   ├── Create doctor accounts
│   ├── Assign departments
│   ├── Manage schedules / shifts
│   ├── View doctor-patient assignments
│   └── Performance overview
│
├── 👤 Patient Management
│   ├── Inpatient list
│   ├── OPD list
│   ├── Patient search (by name, ID, phone)
│   ├── Access patient medical vault (with consent)
│   ├── Assign patients to doctors
│   └── Discharge management
│
├── 📋 Medical Records Access
│   ├── Incoming patient records (emergency)
│   ├── AI triage report viewer
│   ├── Historical visit records
│   └── Referral letters management
│
├── 💳 Insurance Verification
│   ├── Patient insurance validation
│   ├── Coverage verification API
│   ├── Claim initiation portal
│   └── Insurance provider network
│
├── 🚑 Ambulance Management
│   ├── Hospital-owned ambulance fleet
│   ├── GPS live tracking of each ambulance
│   ├── Dispatch system
│   ├── Assignment to emergency cases
│   └── Maintenance schedule
│
└── 📊 Reports & Analytics
    ├── Daily/weekly/monthly patient statistics
    ├── Emergency response time reports
    ├── Bed utilization rates
    ├── Doctor performance metrics
    └── Export as PDF/Excel
```

### 4.3 Hospital Emergency Receive Flow

```
[Emergency Alert Incoming]
        │
        ▼
WebSocket notification to hospital dashboard
        │
        ▼
[Emergency Alert Panel opens automatically]
  ├── Patient name, age, blood group
  ├── AI-summarized condition
  ├── GPS location of patient/ambulance
  ├── ETA to hospital
  ├── Critical vitals if available
  └── Previous relevant medical history
        │
        ▼
Hospital admin clicks [ACCEPT EMERGENCY]
        │
        ▼
  ├── Bed auto-reserved in emergency ward
  ├── Doctor assigned to case
  ├── Alert sent to assigned doctor (WebSocket + SMS)
  ├── Patient confirmed arrival notification
  └── Pre-admission form auto-populated with AI data
```

---

## 5. DOCTOR WORKFLOW ARCHITECTURE

### 5.1 Doctor Account Creation (by Hospital)

```
Hospital Management
        │
        └── Creates Doctor Account
            ├── Full name, specialization, license number
            ├── Department assignment
            ├── Phone, email
            ├── Working hours / shift
            └── System generates credentials → email to doctor
```

### 5.2 Doctor Dashboard Modules

```
DOCTOR DASHBOARD
│
├── 🏠 My Patients (Today)
│   ├── Appointment list (time-sorted)
│   ├── Emergency cases (highlighted)
│   ├── Pending diagnosis cases
│   └── Recent updates from patients
│
├── 🤖 AI Patient Assistant
│   ├── Select patient → AI loads full history
│   ├── Auto-generated patient summary
│   ├── Risk flags highlighted
│   ├── Differential diagnosis suggestions
│   ├── Drug interaction checker
│   └── AI-drafted SOAP note (editable)
│
├── 📋 Patient Records Viewer
│   ├── Medical vault access (assigned patients)
│   ├── MRI/CT/X-Ray viewer with AI overlay
│   ├── Blood report trend graphs
│   ├── ECG waveform viewer
│   └── Prescription history
│
├── ✍️ Clinical Notes
│   ├── SOAP Note editor (Subjective, Objective, Assessment, Plan)
│   ├── AI auto-suggestion while typing
│   ├── ICD-10 code lookup
│   ├── Save as draft / publish
│   └── Publish → synced to patient vault instantly
│
├── 💊 Prescription Writer
│   ├── Medicine name autocomplete
│   ├── Dosage, frequency, duration fields
│   ├── Drug interaction AI check
│   ├── Allergy cross-check against patient profile
│   ├── Digital signature
│   └── Send to patient + hospital pharmacy
│
├── 📄 Report Generator
│   ├── Discharge summary generator (AI-assisted)
│   ├── Referral letter generator
│   ├── Lab order generator
│   ├── AI drafts based on patient data
│   └── Export as PDF → send to patient vault
│
├── 🚨 Emergency Case Handler
│   ├── Emergency alert inbox
│   ├── Patient AI triage summary
│   ├── Accept / Transfer case
│   └── Direct call button to patient location
│
└── 📅 Schedule & Appointments
    ├── Calendar view
    ├── Appointment management
    ├── Telemedicine link generator
    └── Leave management
```

### 5.3 Doctor → AI Workflow

```
Doctor selects patient
        │
        ▼
[Patient Context Loader]
  ├── Fetch all reports from Medical Vault
  ├── Fetch prescription history
  ├── Fetch previous diagnoses
  ├── Fetch AI analyses
  └── Compile into unified context
        │
        ▼
[Gemini AI Doctor Assistant]
  Prompt structure:
  ├── System: "You are a medical AI assistant helping a {specialty} doctor..."
  ├── Patient context: [age, sex, blood group, allergies, conditions, medications]
  ├── Recent reports: [last 5 uploaded reports with AI analyses]
  ├── Task: "Summarize patient, suggest differential diagnosis, flag risks"
  └── Output format: Structured JSON → rendered in UI
        │
        ▼
Doctor reviews AI suggestion
        │
        ▼
Doctor edits / approves → saves as clinical note
        │
        ▼
Synced to patient vault + hospital records
```

---

## 6. EMERGENCY WORKFLOW ARCHITECTURE

### 6.1 Emergency Trigger Sources

```
EMERGENCY CAN BE TRIGGERED BY:
├── Patient presses SOS button
├── AI detects CRITICAL risk in uploaded report
├── AI symptom checker flags emergency
├── Doctor marks patient as emergency
└── Hospital escalates inpatient emergency
```

### 6.2 Full Emergency Execution Flow

```
[EMERGENCY TRIGGERED]
         │
         ▼
┌─────────────────────────────────────────┐
│         EMERGENCY ORCHESTRATOR          │
│              (FastAPI Service)          │
└─────────────────────────────────────────┘
         │
         ├──► [1] GET PATIENT LOCATION
         │        ├── GPS coordinates from device
         │        └── IP-based fallback
         │
         ├──► [2] COMPILE EMERGENCY DATA PACKET
         │        ├── Patient name, age, blood group
         │        ├── Allergies list
         │        ├── Current medications
         │        ├── Last 3 AI analyses (summarized)
         │        ├── Emergency contact list
         │        └── Condition reason (if known)
         │
         ├──► [3] FIND NEARBY HOSPITALS
         │        ├── Google Maps Places API
         │        ├── Filter: Emergency services = YES
         │        ├── Filter: Available emergency beds > 0
         │        ├── Sort by: Distance + ETA
         │        └── Select top 3 candidates
         │
         ├──► [4] SELECT BEST HOSPITAL
         │        ├── Check real-time bed availability (API)
         │        ├── Check ambulance proximity
         │        └── Assign primary + backup hospital
         │
         ├──► [5] BOOK AMBULANCE
         │        ├── Find nearest available ambulance
         │        ├── Send GPS destination
         │        ├── Transmit patient data to ambulance team
         │        └── Start live tracking session
         │
         ├──► [6] ALERT HOSPITAL (WebSocket)
         │        ├── Real-time alert to hospital dashboard
         │        ├── Patient data packet delivery
         │        ├── ETA of ambulance
         │        └── Bed pre-reservation trigger
         │
         ├──► [7] ALERT ASSIGNED DOCTOR (WebSocket + SMS)
         │        ├── Emergency case assignment
         │        ├── Patient summary
         │        └── Preparation instructions
         │
         ├──► [8] ALERT FAMILY CONTACTS
         │        ├── SMS: "Emergency detected for [Name]"
         │        ├── Email: Full emergency details
         │        ├── Live tracking link (shareable)
         │        └── Nearest hospital info
         │
         └──► [9] LIVE TRACKING DASHBOARD
                  ├── Ambulance GPS (real-time WebSocket)
                  ├── Patient location
                  ├── Hospital location
                  ├── Route overlay (Google Maps Directions API)
                  └── ETA countdown
```

### 6.3 Emergency Data Packet Schema

```json
{
  "emergency_id": "EMG-uuid-timestamp",
  "timestamp": "ISO-8601",
  "patient": {
    "uuid": "string",
    "name": "string",
    "age": "integer",
    "sex": "M/F/Other",
    "blood_group": "A+/B+/...",
    "allergies": ["list"],
    "current_medications": ["list"],
    "chronic_conditions": ["list"],
    "emergency_contacts": [
      {
        "name": "string",
        "relation": "string",
        "phone": "string"
      }
    ]
  },
  "location": {
    "latitude": "float",
    "longitude": "float",
    "address": "string",
    "accuracy_meters": "float"
  },
  "ai_triage": {
    "severity": "CRITICAL|HIGH|MEDIUM",
    "probable_condition": "string",
    "key_concerns": ["list"],
    "recommendations": "string"
  },
  "assigned_hospital": {
    "hospital_id": "string",
    "name": "string",
    "address": "string",
    "phone": "string",
    "eta_minutes": "integer"
  },
  "ambulance": {
    "unit_id": "string",
    "driver_name": "string",
    "driver_phone": "string",
    "current_lat": "float",
    "current_lng": "float"
  },
  "status": "INITIATED|AMBULANCE_DISPATCHED|IN_TRANSIT|ARRIVED|ADMITTED"
}
```

---

## 7. AI SYSTEMS ARCHITECTURE

### 7.1 AI Services Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    AI ENGINE LAYER                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             Google Gemini API                        │   │
│  │   Model: gemini-2.0-flash-exp (default)             │   │
│  │   Model: gemini-1.5-pro (complex medical analysis)  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│         ┌─────────────────┼──────────────────┐              │
│         ▼                 ▼                  ▼              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   REPORT    │  │  SYMPTOM     │  │   DOCTOR     │       │
│  │  ANALYZER   │  │  CHECKER     │  │  ASSISTANT   │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│         │                 │                  │              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ TRANSLATION │  │  EMERGENCY   │  │  INSURANCE   │       │
│  │   ENGINE    │  │   TRIAGE     │  │   ADVISOR    │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

### 7.2 AI Service Modules (Code Architecture)

```python
# backend/services/ai/

# ─────────────────────────────────────────────
# ai_config.py — Central AI configuration
# ─────────────────────────────────────────────
import os
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")  # NEVER hardcode

def get_gemini_client(model: str = "gemini-2.0-flash-exp"):
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel(model)

GEMINI_MODELS = {
    "fast":    "gemini-2.0-flash-exp",      # Quick analyses, symptom checker
    "medical": "gemini-1.5-pro",            # Deep medical report analysis
    "vision":  "gemini-1.5-pro-vision",     # Image analysis (MRI, CT, X-Ray)
}

SAFETY_SETTINGS = [
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_MEDICAL", "threshold": "BLOCK_NONE"},
]
```

```python
# ─────────────────────────────────────────────
# report_analyzer.py
# ─────────────────────────────────────────────
from .ai_config import get_gemini_client, GEMINI_MODELS
from typing import Optional
import base64

REPORT_ANALYSIS_PROMPT = """
You are VaidyaAstra Medical AI — an expert medical report analyzer.
You analyze medical reports and provide clear, accurate, patient-friendly explanations.

STRICT RULES:
- Never diagnose definitively. Use "may indicate", "suggests", "consistent with"
- Always recommend professional consultation
- Flag emergency indicators EXPLICITLY
- Respond in VALID JSON only

Report Type: {report_type}
Patient Context: Age {age}, Sex {sex}, Blood Group {blood_group}
Known Allergies: {allergies}
Known Conditions: {conditions}

Analyze the following medical report and return this EXACT JSON structure:
{{
  "report_type": "detected type of report",
  "summary": "2-3 sentence plain language summary",
  "findings": ["finding 1", "finding 2"],
  "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "risk_explanation": "why this risk level was assigned",
  "emergency_indicators": ["list any emergency signs found, empty if none"],
  "specialist_recommendation": "type of specialist to consult",
  "patient_friendly_explanation": "explanation a 10th grader can understand",
  "technical_terms_glossary": {{"term": "explanation"}},
  "next_steps": ["step 1", "step 2"],
  "disclaimer": "This is AI analysis. Always consult a licensed physician."
}}
"""

async def analyze_report(
    file_content: bytes,
    file_type: str,  # "pdf", "image", "dicom"
    report_type: str,  # "mri", "ct", "blood", "ecg", "xray", "prescription", "discharge"
    patient_context: dict,
    language: str = "en"
) -> dict:
    client = get_gemini_client(GEMINI_MODELS["vision"] if file_type == "image" else GEMINI_MODELS["medical"])
    
    prompt = REPORT_ANALYSIS_PROMPT.format(
        report_type=report_type,
        age=patient_context.get("age", "unknown"),
        sex=patient_context.get("sex", "unknown"),
        blood_group=patient_context.get("blood_group", "unknown"),
        allergies=", ".join(patient_context.get("allergies", [])),
        conditions=", ".join(patient_context.get("conditions", [])),
    )
    
    if file_type == "image":
        image_data = base64.b64encode(file_content).decode("utf-8")
        response = client.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": image_data}
        ])
    else:
        # For PDFs — extract text first then analyze
        extracted_text = await extract_pdf_text(file_content)
        response = client.generate_content(f"{prompt}\n\nREPORT CONTENT:\n{extracted_text}")
    
    result = parse_ai_json_response(response.text)
    
    if language != "en":
        result = await translate_analysis(result, language)
    
    return result
```

```python
# ─────────────────────────────────────────────
# symptom_checker.py
# ─────────────────────────────────────────────
SYMPTOM_CHECK_PROMPT = """
You are VaidyaAstra Symptom AI — a medical triage assistant.

Patient Profile:
- Age: {age} | Sex: {sex} | Blood Group: {blood_group}
- Known Conditions: {conditions}
- Current Medications: {medications}

Reported Symptoms:
{symptoms}

Duration: {duration}
Severity (1-10): {severity}
Affected Area: {body_area}

Return EXACT JSON:
{{
  "emergency_level": "EMERGENCY|URGENT|NON_URGENT|SELF_CARE",
  "emergency_action": "Call ambulance immediately" or null,
  "possible_conditions": [
    {{"condition": "name", "probability": "HIGH|MEDIUM|LOW", "explanation": "brief reason"}}
  ],
  "specialist_needed": "General Physician|Cardiologist|etc",
  "home_care_advice": ["advice 1"] or null,
  "warning_signs": ["signs that indicate worsening"],
  "disclaimer": "This is not a diagnosis. Consult a doctor."
}}
"""

async def check_symptoms(symptom_data: dict, patient_context: dict) -> dict:
    client = get_gemini_client()
    prompt = SYMPTOM_CHECK_PROMPT.format(**{**symptom_data, **patient_context})
    response = client.generate_content(prompt)
    return parse_ai_json_response(response.text)
```

```python
# ─────────────────────────────────────────────
# doctor_assistant.py
# ─────────────────────────────────────────────
DOCTOR_ASSIST_PROMPT = """
You are VaidyaAstra Doctor AI — a clinical decision support assistant.
You help {specialty} doctors make informed decisions.

PATIENT SUMMARY:
Name: {name} | Age: {age} | Sex: {sex}
Blood Group: {blood_group} | Allergies: {allergies}
Chronic Conditions: {conditions}
Current Medications: {medications}

RECENT REPORTS & AI ANALYSES:
{reports_summary}

VISIT REASON: {visit_reason}

Provide EXACT JSON:
{{
  "patient_summary": "2 sentence clinical summary",
  "key_risk_flags": ["flag 1", "flag 2"],
  "differential_diagnosis": [
    {{"condition": "name", "likelihood": "High|Medium|Low", "rationale": "reason"}}
  ],
  "suggested_investigations": ["test 1", "test 2"],
  "drug_interactions_to_watch": ["interaction 1"] or [],
  "soap_note_draft": {{
    "subjective": "patient-reported complaints",
    "objective": "objective findings from reports",
    "assessment": "clinical assessment",
    "plan": "suggested treatment plan"
  }},
  "icd10_suggestions": [{{"code": "X00.0", "description": "condition"}}]
}}
"""

async def generate_patient_summary(patient_data: dict, reports: list, doctor_context: dict) -> dict:
    client = get_gemini_client(model="gemini-1.5-pro")
    # build prompt with full context
    prompt = DOCTOR_ASSIST_PROMPT.format(
        specialty=doctor_context.get("specialty"),
        **patient_data,
        reports_summary=format_reports_for_ai(reports),
        visit_reason=doctor_context.get("visit_reason", "General consultation")
    )
    response = client.generate_content(prompt)
    return parse_ai_json_response(response.text)
```

```python
# ─────────────────────────────────────────────
# translation_engine.py
# ─────────────────────────────────────────────
SUPPORTED_LANGUAGES = {
    "en": "English", "hi": "Hindi", "kn": "Kannada",
    "ta": "Tamil", "te": "Telugu", "ml": "Malayalam",
    "mr": "Marathi", "gu": "Gujarati", "bn": "Bengali",
    "pa": "Punjabi", "or": "Odia", "as": "Assamese",
}

TRANSLATION_PROMPT = """
Translate the following medical AI analysis into {language}.
Keep medical terms in English with translation in parentheses.
Make it easy for a non-medical person to understand.
Maintain JSON structure exactly.

Text to translate:
{content}
"""

async def translate_analysis(analysis: dict, target_language: str) -> dict:
    if target_language == "en" or target_language not in SUPPORTED_LANGUAGES:
        return analysis
    
    client = get_gemini_client()
    fields_to_translate = [
        "summary", "patient_friendly_explanation", "risk_explanation",
        "next_steps", "findings"
    ]
    
    for field in fields_to_translate:
        if field in analysis:
            prompt = TRANSLATION_PROMPT.format(
                language=SUPPORTED_LANGUAGES[target_language],
                content=str(analysis[field])
            )
            response = client.generate_content(prompt)
            analysis[f"{field}_{target_language}"] = response.text
    
    return analysis
```

```python
# ─────────────────────────────────────────────
# emergency_triage.py
# ─────────────────────────────────────────────
EMERGENCY_TRIAGE_PROMPT = """
You are VaidyaAstra Emergency AI — a medical emergency triage system.
Analyze this patient data and provide INSTANT triage assessment.

PATIENT: {name}, Age {age}, Blood Group {blood_group}
ALLERGIES: {allergies}
MEDICATIONS: {medications}
TRIGGER: {trigger_reason}
LAST KNOWN VITALS: {vitals}
RECENT AI ANALYSIS FLAGS: {ai_flags}

Return URGENT JSON:
{{
  "triage_color": "RED|ORANGE|YELLOW|GREEN",
  "immediate_actions": ["action 1", "action 2"],
  "probable_emergency": "suspected condition",
  "critical_info_for_paramedic": "key info in 1 sentence",
  "contraindications": ["do NOT give X due to allergy"],
  "hospital_preparation_needed": ["prepare defibrillator", etc]
}}
"""

async def triage_emergency(patient_data: dict, trigger_reason: str) -> dict:
    client = get_gemini_client(model="gemini-2.0-flash-exp")  # Fast model for emergencies
    prompt = EMERGENCY_TRIAGE_PROMPT.format(trigger_reason=trigger_reason, **patient_data)
    response = client.generate_content(prompt)
    return parse_ai_json_response(response.text)
```

---

## 8. GOOGLE MAPS INTEGRATION ARCHITECTURE

### 8.1 APIs Required

```
GOOGLE MAPS PLATFORM APIs:
├── Maps JavaScript API        → Interactive map UI
├── Places API                 → Search nearby hospitals, pharmacies
├── Directions API             → Route calculation (ambulance routes)
├── Distance Matrix API        → ETA calculations to multiple hospitals
├── Geocoding API              → Address ↔ Coordinates conversion
└── Maps Static API            → Static map thumbnails in notifications
```

### 8.2 Frontend Maps Config

```typescript
// frontend/src/config/maps.config.ts

export const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",  // NEVER hardcode
  libraries: ["places", "directions", "geometry"] as const,
  defaultCenter: { lat: 20.5937, lng: 78.9629 },  // India center
  defaultZoom: 12,
};

// Map Themes aligned with VaidyaAstra design system
export const VAIDYAASTRA_MAP_STYLE = [
  { featureType: "water", stylers: [{ color: "#D9EDF7" }] },
  { featureType: "road", stylers: [{ color: "#EAEAEA" }] },
  { featureType: "landscape", stylers: [{ color: "#F8F8F8" }] },
  { featureType: "poi.medical", stylers: [{ visibility: "on" }, { color: "#4F8CFF" }] },
];
```

### 8.3 Backend Maps Service

```python
# backend/services/maps/maps_service.py
import os
import httpx

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

MAPS_API_BASE = "https://maps.googleapis.com/maps/api"

async def find_nearby_hospitals(
    lat: float,
    lng: float,
    radius_meters: int = 10000,
    emergency_only: bool = False
) -> list[dict]:
    """Find hospitals near a GPS coordinate."""
    url = f"{MAPS_API_BASE}/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius_meters,
        "type": "hospital",
        "key": GOOGLE_MAPS_API_KEY,
    }
    if emergency_only:
        params["keyword"] = "emergency"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
    
    hospitals = []
    for place in data.get("results", []):
        hospital = {
            "place_id": place["place_id"],
            "name": place["name"],
            "address": place.get("vicinity", ""),
            "location": place["geometry"]["location"],
            "rating": place.get("rating"),
            "open_now": place.get("opening_hours", {}).get("open_now"),
        }
        hospitals.append(hospital)
    
    return hospitals


async def calculate_route(
    origin_lat: float,
    origin_lng: float,
    dest_lat: float,
    dest_lng: float,
    mode: str = "driving"
) -> dict:
    """Calculate route between two points."""
    url = f"{MAPS_API_BASE}/directions/json"
    params = {
        "origin": f"{origin_lat},{origin_lng}",
        "destination": f"{dest_lat},{dest_lng}",
        "mode": mode,
        "key": GOOGLE_MAPS_API_KEY,
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
    
    if data["routes"]:
        route = data["routes"][0]["legs"][0]
        return {
            "distance_km": route["distance"]["value"] / 1000,
            "duration_minutes": route["duration"]["value"] // 60,
            "polyline": data["routes"][0]["overview_polyline"]["points"],
            "steps": route["steps"],
        }
    return {}


async def get_eta_to_multiple_hospitals(
    origin_lat: float,
    origin_lng: float,
    hospital_locations: list[dict]
) -> list[dict]:
    """Get ETA from patient to multiple hospitals at once."""
    destinations = "|".join([
        f"{h['location']['lat']},{h['location']['lng']}"
        for h in hospital_locations
    ])
    
    url = f"{MAPS_API_BASE}/distancematrix/json"
    params = {
        "origins": f"{origin_lat},{origin_lng}",
        "destinations": destinations,
        "mode": "driving",
        "key": GOOGLE_MAPS_API_KEY,
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
    
    results = []
    for i, element in enumerate(data["rows"][0]["elements"]):
        if element["status"] == "OK":
            hospital_locations[i]["eta_minutes"] = element["duration"]["value"] // 60
            hospital_locations[i]["distance_km"] = element["distance"]["value"] / 1000
            results.append(hospital_locations[i])
    
    return sorted(results, key=lambda x: x["eta_minutes"])
```

### 8.4 Frontend Map Components

```typescript
// Components to build:
// EmergencyMap.tsx         — Live emergency tracking with ambulance + patient + hospital markers
// NearbyHospitalsMap.tsx   — Patient-facing hospital search map
// AmbulanceTracker.tsx     — Real-time ambulance location (WebSocket fed)
// HospitalLocator.tsx      — Search + filter hospitals by specialty
```

---

## 9. BACKEND ARCHITECTURE

### 9.1 FastAPI Application Structure

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager

from .routers import auth, patients, hospitals, doctors, emergency, reports, ai_services
from .database import init_db, init_mongo
from .websockets import websocket_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await init_mongo()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="VaidyaAstra API",
    description="AI-Powered Universal Healthcare Operating System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://vaidyaastra.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router,          prefix="/api/v1/auth",       tags=["Authentication"])
app.include_router(patients.router,      prefix="/api/v1/patients",   tags=["Patients"])
app.include_router(hospitals.router,     prefix="/api/v1/hospitals",  tags=["Hospitals"])
app.include_router(doctors.router,       prefix="/api/v1/doctors",    tags=["Doctors"])
app.include_router(emergency.router,     prefix="/api/v1/emergency",  tags=["Emergency"])
app.include_router(reports.router,       prefix="/api/v1/reports",    tags=["Reports"])
app.include_router(ai_services.router,   prefix="/api/v1/ai",         tags=["AI Services"])

# WebSocket
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket, client_id: str):
    await websocket_manager.connect(websocket, client_id)
```

### 9.2 API Router Definitions

```
REST API ENDPOINTS:

AUTH:
POST   /api/v1/auth/register/patient        → Patient self-registration
POST   /api/v1/auth/register/hospital       → Hospital onboarding (admin only)
POST   /api/v1/auth/create-doctor           → Doctor creation (hospital admin)
POST   /api/v1/auth/login                   → Universal login (role detected)
POST   /api/v1/auth/refresh                 → Refresh JWT token
POST   /api/v1/auth/logout                  → Invalidate token
POST   /api/v1/auth/verify-otp              → OTP verification

PATIENTS:
GET    /api/v1/patients/profile             → Get own profile
PUT    /api/v1/patients/profile             → Update profile
GET    /api/v1/patients/vault               → Get all medical files
POST   /api/v1/patients/vault/upload        → Upload medical file
GET    /api/v1/patients/vault/{file_id}     → Get specific file
DELETE /api/v1/patients/vault/{file_id}     → Delete file
GET    /api/v1/patients/history             → Medical history timeline
GET    /api/v1/patients/appointments        → Appointment list
POST   /api/v1/patients/appointments        → Book appointment
GET    /api/v1/patients/emergency-contacts  → Get contacts
POST   /api/v1/patients/emergency-contacts  → Add contact

HOSPITALS:
GET    /api/v1/hospitals/dashboard          → Hospital overview stats
GET    /api/v1/hospitals/beds               → Bed availability status
PUT    /api/v1/hospitals/beds/{bed_id}      → Update bed status
GET    /api/v1/hospitals/patients           → Admitted patients list
POST   /api/v1/hospitals/doctors            → Create doctor account
GET    /api/v1/hospitals/doctors            → List all hospital doctors
GET    /api/v1/hospitals/emergency-alerts   → Emergency alert queue
POST   /api/v1/hospitals/emergency-alerts/{id}/accept → Accept emergency

DOCTORS:
GET    /api/v1/doctors/profile              → Doctor profile
GET    /api/v1/doctors/patients             → Assigned patients
GET    /api/v1/doctors/patients/{pid}/records → Patient records access
POST   /api/v1/doctors/patients/{pid}/notes  → Add SOAP note
POST   /api/v1/doctors/patients/{pid}/prescription → Write prescription
POST   /api/v1/doctors/patients/{pid}/report → Generate/send report

EMERGENCY:
POST   /api/v1/emergency/trigger            → Trigger emergency (patient SOS)
GET    /api/v1/emergency/{id}/status        → Get emergency status
PUT    /api/v1/emergency/{id}/status        → Update emergency status
GET    /api/v1/emergency/{id}/tracking      → Get tracking data
POST   /api/v1/emergency/{id}/ambulance     → Assign ambulance

AI SERVICES:
POST   /api/v1/ai/analyze-report            → Analyze uploaded report
POST   /api/v1/ai/symptom-check             → Symptom checker
POST   /api/v1/ai/doctor-assist/{pid}       → Doctor AI assistant
POST   /api/v1/ai/emergency-triage          → Emergency triage AI
POST   /api/v1/ai/translate                 → Translate analysis
GET    /api/v1/ai/nearby-hospitals          → Maps: nearby hospitals
GET    /api/v1/ai/route                     → Maps: route calculation

MAPS:
GET    /api/v1/maps/nearby-hospitals        → Nearby hospitals list
GET    /api/v1/maps/route                   → Route between two points
GET    /api/v1/maps/eta                     → ETA to multiple hospitals
```

### 9.3 WebSocket Event System

```python
# backend/websockets/manager.py

from fastapi import WebSocket
from typing import Dict
import json

class WebSocketManager:
    def __init__(self):
        # {client_id: websocket}
        self.active_connections: Dict[str, WebSocket] = {}
        # {room_id: [client_ids]}
        self.rooms: Dict[str, list] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
    
    async def disconnect(self, client_id: str):
        self.active_connections.pop(client_id, None)
    
    async def send_to_client(self, client_id: str, event: str, data: dict):
        if client_id in self.active_connections:
            ws = self.active_connections[client_id]
            await ws.send_json({"event": event, "data": data})
    
    async def broadcast_to_room(self, room_id: str, event: str, data: dict):
        for client_id in self.rooms.get(room_id, []):
            await self.send_to_client(client_id, event, data)
    
    async def join_room(self, client_id: str, room_id: str):
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append(client_id)

# WebSocket Event Types:
EVENTS = {
    "EMERGENCY_INCOMING":      "emergency:incoming",       # Hospital receives emergency
    "EMERGENCY_ACCEPTED":      "emergency:accepted",       # Hospital accepts
    "AMBULANCE_LOCATION":      "ambulance:location",       # Live GPS update
    "EMERGENCY_STATUS_UPDATE": "emergency:status",         # Status changes
    "AI_ANALYSIS_READY":       "ai:analysis_ready",        # Report analyzed
    "NEW_PRESCRIPTION":        "prescription:new",         # Doctor sends Rx
    "NEW_REPORT":              "report:new",               # Doctor sends report
    "BED_STATUS_CHANGE":       "hospital:bed_update",      # Bed availability changed
    "APPOINTMENT_REMINDER":    "appointment:reminder",     # 30min before appt
}
```

### 9.4 JWT Authentication

```python
# backend/auth/jwt_handler.py
import os
import jwt
from datetime import datetime, timedelta
from typing import Optional

JWT_SECRET     = os.getenv("JWT_SECRET_KEY", "")
JWT_ALGORITHM  = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES  = 60
REFRESH_TOKEN_EXPIRE_DAYS    = 7

def create_access_token(data: dict) -> str:
    payload = {
        **data,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(data: dict) -> str:
    payload = {
        **data,
        "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Role-based dependency injection
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def require_patient(token = Depends(security)) -> dict:
    payload = decode_token(token.credentials)
    if payload.get("role") != "patient":
        raise HTTPException(403, "Patient access only")
    return payload

async def require_hospital(token = Depends(security)) -> dict:
    payload = decode_token(token.credentials)
    if payload.get("role") != "hospital":
        raise HTTPException(403, "Hospital access only")
    return payload

async def require_doctor(token = Depends(security)) -> dict:
    payload = decode_token(token.credentials)
    if payload.get("role") != "doctor":
        raise HTTPException(403, "Doctor access only")
    return payload

async def require_hospital_or_doctor(token = Depends(security)) -> dict:
    payload = decode_token(token.credentials)
    if payload.get("role") not in ["hospital", "doctor"]:
        raise HTTPException(403, "Medical professional access only")
    return payload
```

---

## 10. FRONTEND ARCHITECTURE

### 10.1 Application Routing

```typescript
// frontend/src/App.tsx — Route Structure

const routes = [
  // Public routes
  { path: "/",                component: LandingPage },
  { path: "/login",           component: UniversalLoginPage },
  { path: "/register",        component: PatientRegisterPage },
  { path: "/emergency-public",component: PublicEmergencyPage },

  // Patient routes (protected: role=patient)
  { path: "/patient/*", component: PatientLayout, children: [
    { path: "dashboard",       component: PatientDashboard },
    { path: "vault",           component: MedicalVault },
    { path: "vault/:fileId",   component: ReportViewer },
    { path: "ai-analysis",     component: AIAnalysisView },
    { path: "symptom-check",   component: SymptomChecker },
    { path: "emergency",       component: EmergencyPage },
    { path: "hospitals",       component: HospitalFinder },
    { path: "book-doctor",     component: DoctorBooking },
    { path: "insurance",       component: InsuranceAdvisor },
    { path: "history",         component: MedicalHistory },
    { path: "profile",         component: PatientProfile },
    { path: "contacts",        component: EmergencyContacts },
  ]},

  // Hospital routes (protected: role=hospital)
  { path: "/hospital/*", component: HospitalLayout, children: [
    { path: "dashboard",       component: HospitalDashboard },
    { path: "emergency",       component: EmergencyCenter },
    { path: "beds",            component: BedManagement },
    { path: "doctors",         component: DoctorManagement },
    { path: "patients",        component: PatientManagement },
    { path: "patient/:pid",    component: PatientRecordView },
    { path: "ambulance",       component: AmbulanceManagement },
    { path: "insurance",       component: InsurancePortal },
    { path: "reports",         component: HospitalReports },
    { path: "settings",        component: HospitalSettings },
  ]},

  // Doctor routes (protected: role=doctor)
  { path: "/doctor/*", component: DoctorLayout, children: [
    { path: "dashboard",       component: DoctorDashboard },
    { path: "patients",        component: MyPatients },
    { path: "patient/:pid",    component: PatientDetail },
    { path: "patient/:pid/ai", component: AIAssistant },
    { path: "prescribe/:pid",  component: PrescriptionWriter },
    { path: "notes/:pid",      component: ClinicalNotes },
    { path: "emergency",       component: DoctorEmergency },
    { path: "schedule",        component: DoctorSchedule },
    { path: "profile",         component: DoctorProfile },
  ]},
];
```

### 10.2 State Management (Zustand)

```typescript
// frontend/src/store/

// authStore.ts
interface AuthState {
  user: User | null;
  role: "patient" | "hospital" | "doctor" | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// patientStore.ts
interface PatientState {
  profile: PatientProfile | null;
  vault: MedicalFile[];
  analyses: AIAnalysis[];
  appointments: Appointment[];
  emergencyContacts: EmergencyContact[];
  uploadFile: (file: File, type: ReportType) => Promise<void>;
  triggerEmergency: () => Promise<void>;
}

// hospitalStore.ts
interface HospitalState {
  overview: HospitalOverview | null;
  beds: BedMap;
  doctors: Doctor[];
  patients: Patient[];
  emergencyAlerts: EmergencyAlert[];
  acceptEmergency: (emergencyId: string) => Promise<void>;
  updateBedStatus: (bedId: string, status: BedStatus) => void;
}

// doctorStore.ts
interface DoctorState {
  profile: DoctorProfile | null;
  assignedPatients: Patient[];
  currentPatient: PatientDetail | null;
  aiAssistantResult: DoctorAIResult | null;
  loadPatient: (patientId: string) => Promise<void>;
  generateAISummary: (patientId: string) => Promise<void>;
  submitSoapNote: (patientId: string, note: SOAPNote) => Promise<void>;
}

// emergencyStore.ts
interface EmergencyState {
  activeEmergency: Emergency | null;
  ambulanceLocation: LatLng | null;
  nearbyHospitals: Hospital[];
  triggerSOS: () => Promise<void>;
  trackEmergency: (id: string) => void;
}
```

### 10.3 Design System (Tailwind Config)

```typescript
// tailwind.config.ts
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "va-lavender":   "#DCD6F7",   // Soft Lavender — backgrounds
        "va-mint":       "#DDEEE8",   // Pastel Mint — success states
        "va-lime":       "#E7EDB8",   // Light Lime — accents
        "va-blue-light": "#D9EDF7",   // Powder Blue — info states
        "va-white-off":  "#F8F8F8",   // Off White — page background
        "va-white":      "#FFFFFF",   // Pure White — cards
        "va-gray-light": "#EAEAEA",   // Light Gray — borders, dividers
        "va-gray-text":  "#7B7B7B",   // Soft Text Gray — secondary text
        "va-charcoal":   "#2C2C2C",   // Dark Charcoal — headings
        "va-blue":       "#4F8CFF",   // Medium Blue — primary action
        "va-emergency":  "#FF4B4B",   // Emergency Red (SOS button)
        "va-success":    "#2ECC71",   // Success Green
        "va-warning":    "#F39C12",   // Warning Amber
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        medical: ["Source Serif 4", "serif"],  // For medical documents
      },
      borderRadius: {
        "va": "12px",
        "va-lg": "20px",
      },
      boxShadow: {
        "va-card": "0 4px 24px rgba(79, 140, 255, 0.08)",
        "va-hover": "0 8px 32px rgba(79, 140, 255, 0.16)",
        "va-emergency": "0 0 24px rgba(255, 75, 75, 0.4)",
      },
    },
  },
};
```

---

## 11. DATABASE DESIGN

### 11.1 SQLite Schema (Relational Data)

```sql
-- ─────────────────────────────
-- USERS
-- ─────────────────────────────
CREATE TABLE users (
    id              TEXT PRIMARY KEY,    -- UUID
    email           TEXT UNIQUE NOT NULL,
    phone           TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL,       -- 'patient' | 'hospital' | 'doctor'
    is_verified     INTEGER DEFAULT 0,
    is_active       INTEGER DEFAULT 1,
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL
);

-- ─────────────────────────────
-- PATIENTS
-- ─────────────────────────────
CREATE TABLE patients (
    id              TEXT PRIMARY KEY REFERENCES users(id),
    full_name       TEXT NOT NULL,
    date_of_birth   TEXT NOT NULL,
    sex             TEXT NOT NULL,       -- 'M' | 'F' | 'Other'
    blood_group     TEXT,
    address         TEXT,
    city            TEXT,
    state           TEXT,
    pincode         TEXT,
    preferred_language TEXT DEFAULT 'en',
    profile_photo   TEXT,               -- file path
    created_at      TEXT NOT NULL
);

CREATE TABLE patient_health_profile (
    id              TEXT PRIMARY KEY,
    patient_id      TEXT REFERENCES patients(id),
    allergies       TEXT,               -- JSON array
    chronic_conditions TEXT,            -- JSON array
    current_medications TEXT,           -- JSON array
    family_history  TEXT,               -- JSON
    insurance_provider TEXT,
    insurance_number TEXT,
    updated_at      TEXT NOT NULL
);

CREATE TABLE emergency_contacts (
    id              TEXT PRIMARY KEY,
    patient_id      TEXT REFERENCES patients(id),
    name            TEXT NOT NULL,
    relation        TEXT NOT NULL,
    phone           TEXT NOT NULL,
    email           TEXT,
    priority_order  INTEGER DEFAULT 1,
    notify_sms      INTEGER DEFAULT 1,
    notify_email    INTEGER DEFAULT 1
);

-- ─────────────────────────────
-- HOSPITALS
-- ─────────────────────────────
CREATE TABLE hospitals (
    id              TEXT PRIMARY KEY,
    user_id         TEXT REFERENCES users(id),
    name            TEXT NOT NULL,
    registration_no TEXT UNIQUE,
    address         TEXT NOT NULL,
    city            TEXT NOT NULL,
    state           TEXT NOT NULL,
    pincode         TEXT,
    phone           TEXT NOT NULL,
    email           TEXT,
    latitude        REAL,
    longitude       REAL,
    specialties     TEXT,               -- JSON array
    has_emergency   INTEGER DEFAULT 1,
    has_icu         INTEGER DEFAULT 1,
    total_beds      INTEGER DEFAULT 0,
    icu_beds        INTEGER DEFAULT 0,
    is_verified     INTEGER DEFAULT 0,
    created_at      TEXT NOT NULL
);

CREATE TABLE beds (
    id              TEXT PRIMARY KEY,
    hospital_id     TEXT REFERENCES hospitals(id),
    ward_name       TEXT NOT NULL,
    bed_number      TEXT NOT NULL,
    bed_type        TEXT NOT NULL,      -- 'general' | 'icu' | 'emergency' | 'ot'
    status          TEXT DEFAULT 'available', -- 'available' | 'occupied' | 'reserved' | 'maintenance'
    patient_id      TEXT REFERENCES patients(id),
    assigned_at     TEXT,
    updated_at      TEXT NOT NULL
);

CREATE TABLE ambulances (
    id              TEXT PRIMARY KEY,
    hospital_id     TEXT REFERENCES hospitals(id),
    unit_number     TEXT NOT NULL,
    driver_name     TEXT,
    driver_phone    TEXT,
    current_lat     REAL,
    current_lng     REAL,
    status          TEXT DEFAULT 'available', -- 'available' | 'dispatched' | 'maintenance'
    updated_at      TEXT NOT NULL
);

-- ─────────────────────────────
-- DOCTORS
-- ─────────────────────────────
CREATE TABLE doctors (
    id              TEXT PRIMARY KEY REFERENCES users(id),
    hospital_id     TEXT REFERENCES hospitals(id),
    full_name       TEXT NOT NULL,
    specialization  TEXT NOT NULL,
    license_number  TEXT UNIQUE NOT NULL,
    department      TEXT,
    profile_photo   TEXT,
    working_hours   TEXT,               -- JSON schedule
    is_available    INTEGER DEFAULT 1,
    created_at      TEXT NOT NULL
);

CREATE TABLE doctor_patient_assignments (
    id              TEXT PRIMARY KEY,
    doctor_id       TEXT REFERENCES doctors(id),
    patient_id      TEXT REFERENCES patients(id),
    hospital_id     TEXT REFERENCES hospitals(id),
    assigned_at     TEXT NOT NULL,
    is_active       INTEGER DEFAULT 1,
    reason          TEXT
);

-- ─────────────────────────────
-- APPOINTMENTS
-- ─────────────────────────────
CREATE TABLE appointments (
    id              TEXT PRIMARY KEY,
    patient_id      TEXT REFERENCES patients(id),
    doctor_id       TEXT REFERENCES doctors(id),
    hospital_id     TEXT REFERENCES hospitals(id),
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    type            TEXT NOT NULL,      -- 'opd' | 'video' | 'emergency'
    status          TEXT DEFAULT 'scheduled', -- 'scheduled' | 'completed' | 'cancelled'
    notes           TEXT,
    created_at      TEXT NOT NULL
);

-- ─────────────────────────────
-- CLINICAL RECORDS
-- ─────────────────────────────
CREATE TABLE soap_notes (
    id              TEXT PRIMARY KEY,
    patient_id      TEXT REFERENCES patients(id),
    doctor_id       TEXT REFERENCES doctors(id),
    hospital_id     TEXT REFERENCES hospitals(id),
    visit_date      TEXT NOT NULL,
    subjective      TEXT,
    objective       TEXT,
    assessment      TEXT,
    plan            TEXT,
    icd10_codes     TEXT,               -- JSON array
    is_shared_with_patient INTEGER DEFAULT 1,
    created_at      TEXT NOT NULL
);

CREATE TABLE prescriptions (
    id              TEXT PRIMARY KEY,
    patient_id      TEXT REFERENCES patients(id),
    doctor_id       TEXT REFERENCES doctors(id),
    hospital_id     TEXT REFERENCES hospitals(id),
    prescribed_at   TEXT NOT NULL,
    medicines       TEXT NOT NULL,      -- JSON array of {name, dose, freq, duration}
    instructions    TEXT,
    diagnosis       TEXT,
    is_active       INTEGER DEFAULT 1,
    file_path       TEXT                -- PDF version path
);

-- ─────────────────────────────
-- EMERGENCY
-- ─────────────────────────────
CREATE TABLE emergencies (
    id              TEXT PRIMARY KEY,
    patient_id      TEXT REFERENCES patients(id),
    trigger_source  TEXT,               -- 'sos' | 'ai_detected' | 'doctor' | 'hospital'
    triggered_at    TEXT NOT NULL,
    patient_lat     REAL,
    patient_lng     REAL,
    patient_address TEXT,
    assigned_hospital_id TEXT REFERENCES hospitals(id),
    assigned_doctor_id   TEXT REFERENCES doctors(id),
    assigned_ambulance_id TEXT REFERENCES ambulances(id),
    ai_triage_data  TEXT,               -- JSON from emergency_triage AI
    status          TEXT DEFAULT 'initiated',
    -- 'initiated' | 'ambulance_dispatched' | 'in_transit' | 'arrived' | 'admitted' | 'resolved'
    resolved_at     TEXT,
    notes           TEXT
);

CREATE TABLE emergency_updates (
    id              TEXT PRIMARY KEY,
    emergency_id    TEXT REFERENCES emergencies(id),
    timestamp       TEXT NOT NULL,
    update_type     TEXT,               -- 'status_change' | 'location_update' | 'note'
    data            TEXT,               -- JSON
    updated_by      TEXT               -- user UUID who made the update
);
```

### 11.2 MongoDB Collections (Document Data)

```javascript
// Collection: medical_files
{
  _id: ObjectId,
  file_uuid: "uuid-string",
  patient_id: "patient-uuid",
  file_name: "mri_scan_2024.pdf",
  original_name: "scan.pdf",
  file_type: "pdf",           // "pdf" | "image" | "dicom"
  report_type: "mri",         // "mri" | "ct" | "blood" | "ecg" | "xray" | "prescription" | "discharge"
  file_path: "/storage/patients/{id}/reports/{uuid}.pdf",
  file_size_bytes: 2456789,
  mime_type: "application/pdf",
  upload_date: ISODate,
  uploaded_by: "patient-uuid",
  is_shared_with_hospital: [hospital_ids],
  is_shared_with_doctors: [doctor_ids],
  tags: ["orthopedic", "2024"],
  is_deleted: false
}

// Collection: ai_analyses
{
  _id: ObjectId,
  analysis_uuid: "uuid",
  file_uuid: "file-uuid",
  patient_id: "patient-uuid",
  analysis_type: "report_analysis",   // "report_analysis" | "symptom_check" | "emergency_triage"
  ai_model_used: "gemini-1.5-pro",
  request_timestamp: ISODate,
  response_timestamp: ISODate,
  status: "completed",                // "pending" | "processing" | "completed" | "failed"
  result: {
    // Full AI JSON response stored here
    report_type: "MRI Scan",
    summary: "...",
    risk_level: "LOW",
    findings: [],
    specialist_recommendation: "Orthopedic",
    patient_friendly_explanation: "...",
    emergency_indicators: [],
    next_steps: [],
    disclaimer: "..."
  },
  translations: {
    "hi": { summary: "...", explanation: "..." },
    "kn": { summary: "...", explanation: "..." }
  },
  processing_time_ms: 3240,
  error_message: null
}

// Collection: notifications
{
  _id: ObjectId,
  notification_uuid: "uuid",
  recipient_id: "user-uuid",
  recipient_role: "patient",
  type: "ai_analysis_ready",         // see notification types below
  title: "Your MRI Report is Analyzed",
  body: "AI has analyzed your report. Risk level: LOW",
  data: { file_uuid: "...", analysis_uuid: "..." },
  is_read: false,
  created_at: ISODate,
  read_at: null
}

// Collection: audit_logs
{
  _id: ObjectId,
  action: "patient_record_accessed",
  actor_id: "doctor-uuid",
  actor_role: "doctor",
  target_id: "patient-uuid",
  target_type: "patient",
  resource: "medical_vault",
  resource_id: "file-uuid",
  timestamp: ISODate,
  ip_address: "...",
  justification: "emergency_case_EMG-123"  // why access was granted
}

// Collection: hospital_stats (time series)
{
  _id: ObjectId,
  hospital_id: "hospital-uuid",
  date: ISODate,
  beds_occupied: 142,
  beds_available: 58,
  emergencies_received: 3,
  emergencies_resolved: 3,
  avg_response_time_minutes: 8.4,
  patients_admitted: 12,
  patients_discharged: 9
}
```

---

## 12. FILE UPLOAD ARCHITECTURE

### 12.1 Upload Flow

```
[Patient Browser]
    │
    ├── 1. Select file (PDF/Image/DICOM)
    ├── 2. Client-side validation (type, size < 50MB)
    ├── 3. Show upload progress bar
    │
    └── POST /api/v1/patients/vault/upload
        Headers: Authorization: Bearer {token}
        Body: multipart/form-data
          ├── file: <binary>
          ├── report_type: "mri"
          └── description: "MRI of left knee 2024"
              │
              ▼
        [FastAPI File Handler]
          ├── Validate JWT → get patient_id
          ├── Validate file type (whitelist only)
          ├── Validate file size
          ├── Generate file UUID
          ├── Save to disk: /storage/patients/{pid}/reports/{uuid}.{ext}
          ├── Save metadata to MongoDB (medical_files)
          ├── Queue AI analysis job (background task)
          └── Return: { file_uuid, status: "uploaded", analysis_status: "queued" }
```

### 12.2 Accepted File Types

```python
ALLOWED_MIME_TYPES = {
    "mri":          ["application/pdf", "image/jpeg", "image/png", "application/dicom"],
    "ct":           ["application/pdf", "image/jpeg", "image/png", "application/dicom"],
    "xray":         ["image/jpeg", "image/png", "application/pdf", "application/dicom"],
    "blood":        ["application/pdf", "image/jpeg", "image/png"],
    "ecg":          ["application/pdf", "image/jpeg", "image/png"],
    "prescription": ["application/pdf", "image/jpeg", "image/png"],
    "discharge":    ["application/pdf"],
}

MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB
```

### 12.3 Storage Directory Structure

```
/storage/
├── patients/
│   └── {patient_uuid}/
│       ├── reports/
│       │   ├── {file_uuid}.pdf
│       │   └── {file_uuid}.jpg
│       ├── profile/
│       │   └── avatar.jpg
│       └── exports/           ← AI-generated PDF exports
│           └── analysis_{uuid}.pdf
│
├── hospitals/
│   └── {hospital_uuid}/
│       ├── logo.png
│       └── documents/
│
├── doctors/
│   └── {doctor_uuid}/
│       ├── avatar.jpg
│       └── prescriptions/
│           └── {prescription_uuid}.pdf
│
└── temp/                      ← Cleared every 24 hours
    └── upload_{session}.tmp
```

---

## 13. ROLE-BASED SECURITY ARCHITECTURE

### 13.1 Permission Matrix

```
RESOURCE                    PATIENT    HOSPITAL    DOCTOR
─────────────────────────────────────────────────────────
Own profile                 RW         -           -
Own medical files           RW         -           -
AI analysis (own reports)   R          -           -
Emergency SOS trigger       W          -           -
Nearby hospitals            R          -           -

Hospital overview stats     -          RW          R(own)
Create doctor accounts      -          W           -
Bed management              -          RW          R
All admitted patients       -          R           -
Patient records (admitted)  -          R*          R**

Assigned patient records    -          -           RW
SOAP notes                  -          -           RW
Prescriptions write         -          -           W
Reports send to patient     -          -           W

Emergency receive           -          RW          R
Emergency assign doctor     -          W           -

AI Doctor Assistant         -          -           R
AI Report Analyzer          R          R*          R**

*  = Only for patients admitted to that hospital
** = Only for patients assigned to that doctor
```

### 13.2 Data Access Control Implementation

```python
# backend/auth/permissions.py

from functools import wraps
from fastapi import HTTPException

class PermissionChecker:
    
    @staticmethod
    async def patient_owns_file(patient_id: str, file_uuid: str) -> bool:
        """Ensure patient can only access their own files."""
        from ..database.mongo import medical_files_col
        file = await medical_files_col.find_one({"file_uuid": file_uuid})
        return file and file["patient_id"] == patient_id
    
    @staticmethod
    async def doctor_can_access_patient(doctor_id: str, patient_id: str) -> bool:
        """Doctor can access patient only if assigned."""
        from ..database.sqlite import db
        assignment = db.execute(
            "SELECT id FROM doctor_patient_assignments "
            "WHERE doctor_id=? AND patient_id=? AND is_active=1",
            (doctor_id, patient_id)
        ).fetchone()
        return assignment is not None
    
    @staticmethod
    async def hospital_can_access_patient(hospital_id: str, patient_id: str) -> bool:
        """Hospital can access patient only if patient has been admitted."""
        from ..database.sqlite import db
        record = db.execute(
            "SELECT id FROM doctor_patient_assignments "
            "WHERE hospital_id=? AND patient_id=?",
            (hospital_id, patient_id)
        ).fetchone()
        return record is not None
    
    @staticmethod
    async def log_data_access(actor_id: str, actor_role: str, 
                               patient_id: str, resource: str, 
                               resource_id: str, justification: str = ""):
        """Audit log all medical data accesses."""
        from ..database.mongo import audit_logs_col
        from datetime import datetime
        await audit_logs_col.insert_one({
            "action": "patient_data_accessed",
            "actor_id": actor_id,
            "actor_role": actor_role,
            "target_id": patient_id,
            "resource": resource,
            "resource_id": resource_id,
            "timestamp": datetime.utcnow(),
            "justification": justification
        })
```

### 13.3 Consent System

```
PATIENT CONSENT CONTROLS:
├── Medical files: Patient can toggle sharing per file
│   ├── "Share with my assigned doctors only" (default: ON)
│   ├── "Share with hospital on emergency" (default: ON)
│   └── "Share with family contacts" (default: OFF)
│
├── Emergency override:
│   └── In emergency, hospital/doctor gets READ access to critical records
│       even if sharing is OFF — but this is logged in audit trail
│
└── Patient can revoke access at any time
    └── Revocation creates audit entry
```

---

## 14. API COMMUNICATION ARCHITECTURE

### 14.1 Frontend API Client

```typescript
// frontend/src/api/client.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().refreshToken();
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 14.2 WebSocket Client

```typescript
// frontend/src/api/websocket.ts
class VaidyaAstraWebSocket {
  private ws: WebSocket | null = null;
  private clientId: string;
  private handlers: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnects = 5;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  connect() {
    const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";
    this.ws = new WebSocket(`${WS_URL}/ws/${this.clientId}`);
    
    this.ws.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data);
      this.handlers.get(eventType)?.forEach(handler => handler(data));
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnects) {
        setTimeout(() => this.connect(), 2000 * ++this.reconnectAttempts);
      }
    };
  }

  on(event: string, handler: Function) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event)!.push(handler);
    return this;  // chainable
  }

  disconnect() { this.ws?.close(); }
}

// Usage:
// const ws = new VaidyaAstraWebSocket(userId);
// ws.on("emergency:incoming", handleEmergency)
//   .on("ai:analysis_ready", handleAnalysisReady);
// ws.connect();
```

### 14.3 Notification Service (Email + SMS)

```python
# backend/services/notifications/

# email_service.py
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST     = os.getenv("SMTP_HOST", "")
SMTP_PORT     = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER     = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL    = os.getenv("FROM_EMAIL", "noreply@vaidyaastra.com")

async def send_emergency_email(to: str, patient_name: str, emergency_data: dict):
    subject = f"🚨 EMERGENCY ALERT — {patient_name} needs help"
    html_body = render_emergency_email_template(patient_name, emergency_data)
    await send_email(to, subject, html_body)

# sms_service.py (Twilio / MSG91 / Fast2SMS)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN  = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE       = os.getenv("TWILIO_FROM_PHONE", "")
MSG91_API_KEY      = os.getenv("MSG91_API_KEY", "")   # India SMS alternative
```

---

## 15. ENVIRONMENT VARIABLES STRUCTURE

### .env.example

```bash
# ════════════════════════════════════════════════════
# VAIDYAASTRA — Environment Variables Template
# Copy this file to .env and fill in your values
# NEVER commit .env to version control
# ════════════════════════════════════════════════════

# ── APP ──────────────────────────────────────────────
APP_NAME=VaidyaAstra
APP_VERSION=1.0.0
ENVIRONMENT=development             # development | staging | production
DEBUG=true
SECRET_KEY=                         # Generate: openssl rand -hex 32

# ── BACKEND SERVER ────────────────────────────────────
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ── AUTHENTICATION ───────────────────────────────────
JWT_SECRET_KEY=                     # Generate: openssl rand -hex 64
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# ── DATABASE (SQLite) ─────────────────────────────────
SQLITE_DB_PATH=./data/vaidyaastra.db

# ── DATABASE (MongoDB) ───────────────────────────────
MONGODB_URI=mongodb://localhost:27017/vaidyaastra
MONGODB_DB_NAME=vaidyaastra

# ── AI — GOOGLE GEMINI ───────────────────────────────
GEMINI_API_KEY=                     # Get from: https://aistudio.google.com/
GEMINI_DEFAULT_MODEL=gemini-2.0-flash-exp
GEMINI_MEDICAL_MODEL=gemini-1.5-pro
GEMINI_VISION_MODEL=gemini-1.5-pro
GEMINI_MAX_TOKENS=8192
GEMINI_TEMPERATURE=0.3              # Lower = more conservative medical answers

# ── GOOGLE MAPS ──────────────────────────────────────
GOOGLE_MAPS_API_KEY=                # Get from: https://console.cloud.google.com/
GOOGLE_MAPS_BACKEND_KEY=            # Separate server-side key (no referrer restrictions)

# ── FILE STORAGE ──────────────────────────────────────
STORAGE_TYPE=local                  # local | s3 | gcs
STORAGE_LOCAL_PATH=./storage
MAX_UPLOAD_SIZE_MB=50

# ── CLOUD STORAGE (if STORAGE_TYPE=s3) ───────────────
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
AWS_S3_REGION=ap-south-1

# ── EMAIL (SMTP) ──────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
FROM_EMAIL=noreply@vaidyaastra.com
FROM_NAME=VaidyaAstra Health

# ── SMS — TWILIO ──────────────────────────────────────
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_PHONE=

# ── SMS — MSG91 (India Alternative) ──────────────────
MSG91_API_KEY=
MSG91_SENDER_ID=VASTRA
MSG91_TEMPLATE_EMERGENCY=

# ── OTP SERVICE ───────────────────────────────────────
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=6

# ── RATE LIMITING ─────────────────────────────────────
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_AI_PER_HOUR=100
RATE_LIMIT_UPLOAD_PER_DAY=20

# ── FRONTEND ──────────────────────────────────────────
# (Vite env — must start with VITE_)
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=           # Frontend-side Maps key
VITE_APP_NAME=VaidyaAstra
VITE_EMERGENCY_PHONE=112            # National emergency number

# ── ADMIN ─────────────────────────────────────────────
PLATFORM_ADMIN_EMAIL=admin@vaidyaastra.com
PLATFORM_ADMIN_PASSWORD=            # Change immediately after setup
```

---

## 16. COMPLETE FOLDER STRUCTURE

```
vaidyaastra/
│
├── 📄 README.md
├── 📄 .env.example                         ← Copy & fill → .env
├── 📄 .env                                 ← NEVER commit this
├── 📄 .gitignore
├── 📄 docker-compose.yml
│
├── 🖥️ frontend/                            ← React + TypeScript + Tailwind
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   │
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── vite-env.d.ts
│       │
│       ├── api/                            ← HTTP + WebSocket clients
│       │   ├── client.ts                   ← Axios instance
│       │   ├── websocket.ts                ← WS client class
│       │   ├── auth.api.ts
│       │   ├── patient.api.ts
│       │   ├── hospital.api.ts
│       │   ├── doctor.api.ts
│       │   ├── emergency.api.ts
│       │   ├── ai.api.ts
│       │   └── maps.api.ts
│       │
│       ├── store/                          ← Zustand state stores
│       │   ├── authStore.ts
│       │   ├── patientStore.ts
│       │   ├── hospitalStore.ts
│       │   ├── doctorStore.ts
│       │   └── emergencyStore.ts
│       │
│       ├── pages/                          ← Full-page route components
│       │   ├── public/
│       │   │   ├── LandingPage.tsx
│       │   │   ├── UniversalLoginPage.tsx
│       │   │   └── PatientRegisterPage.tsx
│       │   │
│       │   ├── patient/
│       │   │   ├── PatientDashboard.tsx
│       │   │   ├── MedicalVault.tsx
│       │   │   ├── ReportViewer.tsx
│       │   │   ├── AIAnalysisView.tsx
│       │   │   ├── SymptomChecker.tsx
│       │   │   ├── EmergencyPage.tsx
│       │   │   ├── HospitalFinder.tsx
│       │   │   ├── DoctorBooking.tsx
│       │   │   ├── InsuranceAdvisor.tsx
│       │   │   ├── MedicalHistory.tsx
│       │   │   ├── EmergencyContacts.tsx
│       │   │   └── PatientProfile.tsx
│       │   │
│       │   ├── hospital/
│       │   │   ├── HospitalDashboard.tsx
│       │   │   ├── EmergencyCenter.tsx
│       │   │   ├── BedManagement.tsx
│       │   │   ├── DoctorManagement.tsx
│       │   │   ├── PatientManagement.tsx
│       │   │   ├── PatientRecordView.tsx
│       │   │   ├── AmbulanceManagement.tsx
│       │   │   ├── InsurancePortal.tsx
│       │   │   ├── HospitalReports.tsx
│       │   │   └── HospitalSettings.tsx
│       │   │
│       │   └── doctor/
│       │       ├── DoctorDashboard.tsx
│       │       ├── MyPatients.tsx
│       │       ├── PatientDetail.tsx
│       │       ├── AIAssistant.tsx
│       │       ├── PrescriptionWriter.tsx
│       │       ├── ClinicalNotes.tsx
│       │       ├── DoctorEmergency.tsx
│       │       ├── DoctorSchedule.tsx
│       │       └── DoctorProfile.tsx
│       │
│       ├── components/                     ← Reusable UI components
│       │   ├── layout/
│       │   │   ├── PatientLayout.tsx       ← Nav + sidebar for patients
│       │   │   ├── HospitalLayout.tsx
│       │   │   ├── DoctorLayout.tsx
│       │   │   └── PublicLayout.tsx
│       │   │
│       │   ├── common/
│       │   │   ├── VaButton.tsx            ← Design-system button
│       │   │   ├── VaCard.tsx              ← Design-system card
│       │   │   ├── VaModal.tsx
│       │   │   ├── VaBadge.tsx             ← Risk level badges
│       │   │   ├── VaInput.tsx
│       │   │   ├── VaFileUpload.tsx
│       │   │   ├── VaLoader.tsx
│       │   │   ├── VaToast.tsx
│       │   │   └── VaLanguagePicker.tsx
│       │   │
│       │   ├── medical/
│       │   │   ├── ReportCard.tsx          ← File card in vault
│       │   │   ├── AIAnalysisCard.tsx      ← Analysis result display
│       │   │   ├── RiskBadge.tsx           ← LOW/MEDIUM/HIGH/CRITICAL
│       │   │   ├── MedicalTimeline.tsx     ← History chronology
│       │   │   ├── VitalCard.tsx
│       │   │   ├── PrescriptionCard.tsx
│       │   │   └── SOAPNoteViewer.tsx
│       │   │
│       │   ├── maps/
│       │   │   ├── EmergencyMap.tsx        ← Live emergency tracking
│       │   │   ├── NearbyHospitalsMap.tsx
│       │   │   ├── AmbulanceTracker.tsx
│       │   │   └── HospitalMarker.tsx
│       │   │
│       │   ├── ai/
│       │   │   ├── SymptomForm.tsx
│       │   │   ├── AIResponseCard.tsx
│       │   │   ├── DoctorAIPanel.tsx
│       │   │   └── TranslationToggle.tsx
│       │   │
│       │   └── emergency/
│       │       ├── SOSButton.tsx           ← Big red button (always visible)
│       │       ├── EmergencyAlertBanner.tsx
│       │       ├── EmergencyCard.tsx       ← Hospital alert card
│       │       └── AmbulanceStatusCard.tsx
│       │
│       ├── hooks/                          ← Custom React hooks
│       │   ├── useAuth.ts
│       │   ├── useGeolocation.ts
│       │   ├── useWebSocket.ts
│       │   ├── useFileUpload.ts
│       │   ├── useAIAnalysis.ts
│       │   └── useEmergency.ts
│       │
│       ├── types/                          ← TypeScript type definitions
│       │   ├── user.types.ts
│       │   ├── patient.types.ts
│       │   ├── hospital.types.ts
│       │   ├── doctor.types.ts
│       │   ├── medical.types.ts
│       │   ├── emergency.types.ts
│       │   └── ai.types.ts
│       │
│       ├── utils/
│       │   ├── dateUtils.ts
│       │   ├── fileUtils.ts
│       │   ├── formatters.ts
│       │   └── validators.ts
│       │
│       └── config/
│           ├── maps.config.ts
│           ├── routes.config.ts
│           └── constants.ts
│
├── 🐍 backend/                             ← FastAPI + Python
│   ├── requirements.txt
│   ├── main.py
│   ├── .env (symlink or copy)
│   │
│   ├── routers/                            ← API route handlers
│   │   ├── auth.py
│   │   ├── patients.py
│   │   ├── hospitals.py
│   │   ├── doctors.py
│   │   ├── emergency.py
│   │   ├── reports.py
│   │   └── ai_services.py
│   │
│   ├── models/                             ← Pydantic request/response models
│   │   ├── auth_models.py
│   │   ├── patient_models.py
│   │   ├── hospital_models.py
│   │   ├── doctor_models.py
│   │   ├── emergency_models.py
│   │   ├── report_models.py
│   │   └── ai_models.py
│   │
│   ├── services/                           ← Business logic
│   │   ├── ai/
│   │   │   ├── ai_config.py
│   │   │   ├── report_analyzer.py
│   │   │   ├── symptom_checker.py
│   │   │   ├── doctor_assistant.py
│   │   │   ├── emergency_triage.py
│   │   │   ├── translation_engine.py
│   │   │   └── insurance_advisor.py
│   │   │
│   │   ├── maps/
│   │   │   └── maps_service.py
│   │   │
│   │   ├── emergency/
│   │   │   ├── emergency_orchestrator.py
│   │   │   └── ambulance_service.py
│   │   │
│   │   ├── notifications/
│   │   │   ├── email_service.py
│   │   │   ├── sms_service.py
│   │   │   └── push_service.py
│   │   │
│   │   └── files/
│   │       ├── file_service.py
│   │       ├── pdf_extractor.py
│   │       └── storage_service.py
│   │
│   ├── auth/
│   │   ├── jwt_handler.py
│   │   ├── password_handler.py
│   │   ├── otp_handler.py
│   │   └── permissions.py
│   │
│   ├── database/
│   │   ├── sqlite.py                       ← SQLite connection + init
│   │   ├── mongo.py                        ← MongoDB connection
│   │   └── migrations/
│   │       └── 001_initial_schema.sql
│   │
│   ├── websockets/
│   │   ├── manager.py                      ← WebSocket connection manager
│   │   └── events.py                       ← Event type constants
│   │
│   ├── background_tasks/
│   │   ├── ai_analysis_worker.py
│   │   ├── notification_worker.py
│   │   └── cleanup_worker.py
│   │
│   └── utils/
│       ├── validators.py
│       ├── formatters.py
│       └── helpers.py
│
├── 💾 data/
│   └── vaidyaastra.db                      ← SQLite database file
│
├── 🗂️ storage/                             ← Uploaded files (local dev)
│   ├── patients/
│   ├── hospitals/
│   ├── doctors/
│   └── temp/
│
├── 📜 scripts/
│   ├── setup.sh                            ← One-command setup
│   ├── seed_data.py                        ← Demo data seeding
│   └── create_admin.py                     ← Create platform admin
│
└── 🐳 docker/
    ├── Dockerfile.frontend
    ├── Dockerfile.backend
    └── nginx.conf
```

---

## 17. DATA FLOW DIAGRAMS

### 17.1 Patient → Hospital Data Flow

```
PATIENT uploads report
        │
        ▼
[Backend stores in /storage/patients/{id}/]
        │
        ▼
[MongoDB: medical_files collection updated]
        │
        ▼
[AI Analysis Queue → Gemini API]
        │
        ▼
[MongoDB: ai_analyses collection updated]
        │
        ▼
[IF emergency detected]:
  Patient ←── WebSocket: emergency detected
  Hospital ←── WebSocket: incoming emergency + patient data
  Doctor ←── WebSocket: emergency case assigned
  Family ←── SMS + Email alerts
        │
[IF not emergency]:
  Patient ←── WebSocket: analysis_ready notification
        │
        ▼
[Patient shares file with hospital during visit]:
  MongoDB: medical_files.is_shared_with_hospital.push(hospital_id)
  Hospital can now READ the file via API
```

### 17.2 Doctor → Patient Data Flow

```
Doctor adds SOAP note / Prescription / Report
        │
        ▼
[Backend validates doctor-patient assignment]
        │
        ▼
[SQLite: soap_notes / prescriptions table updated]
        │
        ▼
[PDF generated if prescription/report]
[Stored in /storage/doctors/{id}/prescriptions/]
        │
        ▼
[MongoDB: medical_files updated with doctor-sent file]
[Appears in Patient's Medical Vault instantly]
        │
        ▼
Patient ←── WebSocket: new_prescription / new_report event
Patient ←── Push notification + Email
```

### 17.3 Emergency Full Data Flow

```
[PATIENT triggers SOS]
        │
        ├──► GPS coordinates captured
        ├──► AI emergency triage runs (< 3 seconds)
        ├──► Emergency record created in SQLite
        │
        ├──► Google Maps: find nearest emergency hospitals
        ├──► Distance Matrix API: calculate ETAs
        ├──► Best hospital selected
        │
        ├──► Ambulance dispatched from hospital fleet
        │    └── Ambulance GPS → WebSocket → All parties
        │
        ├──► HOSPITAL notified:
        │    └── WebSocket event + audio alert in dashboard
        │        └── Patient data packet received
        │            └── Bed pre-reserved
        │
        ├──► DOCTOR notified:
        │    └── WebSocket + SMS
        │        └── Patient summary + ETA
        │
        ├──► FAMILY notified:
        │    └── SMS + Email + Live tracking link
        │
        └──► Live tracking WebSocket room created:
             ├── Patient/family can watch ambulance location
             ├── Hospital sees ETA countdown
             └── Updates every 5 seconds via WebSocket
```

---

## 18. DEPLOYMENT FOUNDATION

### 18.1 Docker Compose (Development)

```yaml
# docker-compose.yml
version: "3.9"

services:
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/Dockerfile.backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - ./storage:/storage
      - ./data:/data
    env_file:
      - .env
    depends_on:
      - mongodb

  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/Dockerfile.frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    env_file:
      - .env

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: vaidyaastra

volumes:
  mongo_data:
```

### 18.2 requirements.txt (Backend)

```
fastapi==0.115.0
uvicorn[standard]==0.30.0
python-multipart==0.0.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pydantic==2.8.0
pydantic-settings==2.4.0
google-generativeai==0.7.2
httpx==0.27.0
motor==3.5.0             # Async MongoDB
aiosqlite==0.20.0
pymongo==4.8.0
PyPDF2==3.0.1
Pillow==10.4.0
python-dotenv==1.0.1
pyotp==2.9.0
twilio==9.2.0
```

### 18.3 package.json (Frontend)

```json
{
  "name": "vaidyaastra-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "zustand": "^4.5.0",
    "axios": "^1.7.0",
    "framer-motion": "^11.3.0",
    "@react-google-maps/api": "^2.19.0",
    "react-dropzone": "^14.2.0",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.439.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### 18.4 Quick Start Script

```bash
#!/bin/bash
# scripts/setup.sh — One-command project setup

echo "🏥 Setting up VaidyaAstra..."

# Copy env
cp .env.example .env
echo "⚠️  Please fill in API keys in .env before starting"

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Initialize database
python -c "from database.sqlite import init_db; import asyncio; asyncio.run(init_db())"
python scripts/seed_data.py

echo "🐍 Backend ready. Run: uvicorn main:app --reload"

# Frontend setup
cd ../frontend
echo "📦 Installing frontend dependencies..."
npm install

echo "⚛️  Frontend ready. Run: npm run dev"

echo ""
echo "✅ VaidyaAstra setup complete!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:5173"
echo "   API Docs: http://localhost:8000/docs"
```

---

## 19. COMPLETION SUMMARY & NEXT PROMPT

### What Was Completed ✅

| Section | Status | Description |
|---|---|---|
| System Overview | ✅ | Full platform mission, architecture type, problem-solution map |
| Three-User Model | ✅ | Patient, Hospital, Doctor roles with exact permissions |
| Patient Workflow | ✅ | All 11 dashboard modules, upload flow, AI analysis pipeline |
| Hospital Workflow | ✅ | All 9 dashboard modules, emergency receive flow, bed management |
| Doctor Workflow | ✅ | All 9 dashboard modules, AI assistant integration, clinical tools |
| Emergency System | ✅ | Complete 9-step orchestration, data packet schema, live tracking |
| AI Architecture | ✅ | 6 AI services, full prompts, Gemini integration (keys empty) |
| Google Maps | ✅ | 6 APIs configured, frontend + backend code, tracking system |
| Backend (FastAPI) | ✅ | App structure, 50+ REST endpoints, WebSocket system, JWT auth |
| Frontend (React) | ✅ | Full routing, Zustand stores, design system, component tree |
| Database Design | ✅ | Complete SQLite schema (12 tables) + MongoDB collections (5) |
| File Upload | ✅ | Full upload pipeline, file type validation, storage structure |
| Security | ✅ | RBAC permission matrix, data access control, consent system, audit logs |
| API Communication | ✅ | Axios client, WebSocket client, notification service |
| Environment Vars | ✅ | Complete .env.example with 50+ variables, all keys empty/placeholder |
| Folder Structure | ✅ | 100+ files mapped across frontend + backend |
| Data Flow Diagrams | ✅ | 3 complete flow diagrams with step-by-step arrows |
| Deployment | ✅ | Docker Compose, requirements.txt, package.json, setup script |

### How All 3 User Types Connect

```
PATIENT (self-registers)
    ↓ uploads reports → AI analyzes → stored in vault
    ↓ triggers emergency → data flows to →
    
HOSPITAL (receives emergency alert)
    ↓ accepts case → assigns to →
    
DOCTOR (receives patient assignment)
    ↓ reviews AI summary + reports
    ↓ adds SOAP note / prescription → syncs back to →
    
PATIENT (sees report in vault)
```

### APIs Prepared (Keys Empty)

| API | Key Variable | Purpose |
|---|---|---|
| Google Gemini | `GEMINI_API_KEY` | All AI services |
| Google Maps Backend | `GOOGLE_MAPS_API_KEY` | Server-side Maps calls |
| Google Maps Frontend | `VITE_GOOGLE_MAPS_API_KEY` | Frontend map rendering |
| Twilio SMS | `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` | SMS alerts |
| MSG91 (India) | `MSG91_API_KEY` | Alternative India SMS |
| SMTP Email | `SMTP_HOST/USER/PASSWORD` | Email notifications |

---

### 🔜 WHAT THE NEXT PROMPT SHOULD BUILD

Copy-paste this as your next prompt to continue:

```
Continue building VaidyaAstra exactly from the master architecture in VAIDYAASTRA_ARCHITECTURE.md.

BUILD PHASE 1 — BACKEND FOUNDATION:

1. Set up the FastAPI project structure exactly as defined in Section 16.
2. Create backend/database/sqlite.py — implement init_db() with all 12 tables from Section 11.1.
3. Create backend/database/mongo.py — implement init_mongo() with all 5 collections.
4. Create backend/auth/jwt_handler.py — full JWT implementation from Section 9.4.
5. Create backend/auth/password_handler.py — bcrypt hashing.
6. Create backend/auth/otp_handler.py — OTP generation + verification.
7. Create backend/routers/auth.py — implement ALL auth endpoints:
   - POST /api/v1/auth/register/patient
   - POST /api/v1/auth/login (universal, detects role)
   - POST /api/v1/auth/verify-otp
   - POST /api/v1/auth/refresh
   - POST /api/v1/auth/logout
8. Create backend/models/auth_models.py — all Pydantic models for auth.
9. Create backend/main.py — full FastAPI app with CORS + all routers included.
10. Create requirements.txt from Section 18.2.
11. Create .env.example from Section 15.
12. Create scripts/setup.sh from Section 18.4.

Use the VaidyaAstra design colors from Section 10.3.
Use SQLite async (aiosqlite) for all DB operations.
All API keys must remain as empty environment variables — NEVER hardcode.
Produce working, runnable code files saved to the VaidyaAstra workspace folder.
```

---

*VaidyaAstra Master Architecture v1.0 — Foundation Blueprint Complete*
*"Technology that heals" — Built with purpose, designed for every patient.*
