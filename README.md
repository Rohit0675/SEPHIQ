# SEPHIQ — From Signals to Strategy

**SEPHIQ** is an AI-assisted Competitive Intelligence Platform designed to transform competitive market signals into structured strategic insights.

It combines:

- Competitive signal monitoring
- Multi-company comparison
- Evidence-led analysis
- Strategic recommendations
- AI-assisted interpretation
- Custom strategic questions
- Saved reports
- Firebase authentication
- Firestore report storage
- Structured competitor profiles
- A synthetic internal company benchmark

---

# 1. Quick Start

## Prerequisites

Make sure the following are installed:

- Python 3.10+
- Node.js 18+
- npm
- Git

Optional:

- Ollama for local LLM-powered analysis

---

# 2. Clone the Repository

```powershell
git clone https://github.com/Rohit0675/SEPHIQ.git
cd SEPHIQ
```

---

# 3. Backend Setup

Open PowerShell in the project directory.

```powershell
cd backend
```

Create a Python virtual environment:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate again:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the FastAPI backend:

```powershell
uvicorn app.main:app --reload --port 8000
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Health check:

```powershell
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "SEPHIQ Agent",
  "version": "2.0.0"
}
```

---

# 4. Frontend Setup

Open a **second PowerShell window**.

From the project root:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Create the local environment file:

```powershell
copy .env.example .env.local
```

Open:

```text
frontend/.env.local
```

Configure the required values.

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000

VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

Start the frontend:

```powershell
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 5. Run SEPHIQ

SEPHIQ requires both services to be running.

### Terminal 1 — Backend

```powershell
cd C:\Users\piyus\Documents\SEPHIQ\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

### Terminal 2 — Frontend

```powershell
cd C:\Users\piyus\Documents\SEPHIQ\frontend
npm run dev
```

Then open the frontend URL shown by Vite.

---

# 6. Product Overview

SEPHIQ is built around the workflow:

```text
Competitive Signals
        ↓
Evidence Collection
        ↓
Company Comparison
        ↓
Strategic Question
        ↓
Evidence-led Analysis
        ↓
Strategic Recommendations
        ↓
Saved Strategic Report
```

The platform is designed to answer questions such as:

- Which competitor is moving fastest in AI?
- How are competitors evolving their collaboration capabilities?
- What are the major strategic differences between Figma and Canva?
- How does Nexora compare with Notion?
- Which competitor shows stronger movement in a selected category?
- What strategic implications should Nexora consider?
- What are the most important recent competitive developments?

Users can either use the automatically generated question or replace it with their own strategic question.

---

# 7. Companies Tracked

SEPHIQ currently supports four entities.

## Nexora

Nexora is the synthetic/internal benchmark company used by the platform.

It represents an all-in-one digital workspace combining:

- Design
- Documents
- Collaboration
- AI
- Project management

Nexora is intentionally modeled as approximately:

**80% structurally similar + 20% differentiated**

against the competitive landscape.

Its modeled differentiators include:

- Voice-to-design generation
- Offline-first sync engine
- Cross-team sentiment dashboard
- Regulatory compliance templates
- Creator micro-licensing marketplace

Nexora is a fictional analytical benchmark and should not be interpreted as a real company.

---

## Figma

SEPHIQ tracks Figma as a design and product-development competitor.

The structured profile includes capabilities such as:

- Collaborative canvas
- Multiplayer editing
- Design systems
- Prototyping
- Dev Mode
- Figma Make
- Figma Agent
- Figma Weave
- Figma Motion
- FigJam
- Figma Slides
- Integrations and MCP

---

## Canva

SEPHIQ tracks Canva as a visual communication and productivity competitor.

The structured profile includes:

- Visual Suite
- Templates
- Brand Kit
- Real-time collaboration
- Docs
- Sheets
- Whiteboards
- Presentations
- Websites
- Video
- Canva AI
- Magic Layers
- Canva Code
- Offline mode
- ProSuite

---

## Notion

SEPHIQ tracks Notion as a knowledge and workflow competitor.

The structured profile includes:

- Docs
- Databases
- Real-time collaboration
- AI Meeting Notes
- AI Search
- Notion Agent
- Custom Agents
- Agent skills
- Workers
- MCP connections
- Calendar tools
- AI model controls
- External agents

---

# 8. Competitive Intelligence Signals

SEPHIQ includes a structured competitive change-history dataset.

The current monitored dataset contains signals from:

- Figma
- Canva
- Notion

These signals are organized around:

- Company
- Date
- Title
- Category
- Summary
- Source
- Source URL

The current dataset contains **19 monitored competitive signals**.

### Figma

Examples include developments around:

- Figma Agent
- GitHub organization connections
- Motion
- Figma Community
- Mobile collaboration
- Auto Layout
- Weave workflows

Official source:

https://www.figma.com/release-notes/

### Notion

Examples include developments around:

- Notion Agents
- Agent skills
- AI model controls
- Agent edits
- Developer Portal
- AI Meeting Notes
- Calendar tools
- External agents

Official source:

https://www.notion.com/releases

### Canva

Examples include developments around:

- Canva ProSuite
- Visual Suite updates
- AI capabilities
- Canva World Tour
- AI Vision
- Canva for nonprofits

Official sources include:

https://www.canva.com/newsroom/news/

---

# 9. Core Features

## Competitive Comparison

Users can select between:

- 2 companies
- 3 companies
- 4 companies

Supported combinations include:

```text
Nexora vs Figma
Nexora vs Canva
Nexora vs Notion

Figma vs Canva
Figma vs Notion
Canva vs Notion

Nexora vs Figma vs Canva
Nexora vs Figma vs Notion
Nexora vs Canva vs Notion

Nexora vs Figma vs Canva vs Notion
```

---

## Category Filtering

Users can filter the analysis using categories such as:

- All
- AI
- Design
- Collaboration
- Project Management
- Automation
- Security
- Integrations
- Pricing

---

## Date Filtering

The comparison engine supports:

- From date
- To date

This allows users to focus analysis on a specific evidence window.

---

## Automatic Strategic Question

SEPHIQ automatically generates a question based on the selected:

- Companies
- Category

For example:

```text
Compare recent AI developments across Nexora, Figma and Notion
and identify the strategic implications.
```

---

## Custom Strategic Questions

Users are not restricted to the generated question.

They can replace it with a custom question such as:

```text
Which company is moving fastest in AI agents and what does
this mean for Nexora?
```

or:

```text
How is Canva positioning itself differently from Figma
in the current competitive landscape?
```

or:

```text
Which capabilities should Nexora prioritize based on the
current competitive movements?
```

The backend uses the submitted question as the analysis lens.

---

# 10. Analysis Output

SEPHIQ returns a structured strategic analysis containing:

### Strategic Answer

A direct synthesis of the selected evidence.

### Key Findings

Important observations derived from the available evidence.

### Common Themes

Capabilities or strategic themes shared across the selected companies.

### Differences

Important competitive differences.

### Strategic Recommendations

Actions or strategic considerations for the benchmark company.

### Comparison Scorecard

A structured comparison across the selected companies.

### Feature Matrix

A capability-level comparison.

### Competitor Profiles

Structured positioning and capability information.

### Sources

Evidence references used in the analysis.

### Limitations

Important caveats about the available evidence.

### Metrics

Supporting analytical measurements.

---

# 11. Backend Architecture

The application follows:

```text
React Frontend
      │
      ▼
SEPHIQ Agent Service
      │
      ▼
Evidence + Analysis Engine
      │
      ├── Nexora Internal Data
      ├── Competitor Profiles
      ├── Competitive Signal History
      └── Optional Ollama LLM
```

The backend is implemented using:

- Python
- FastAPI
- Pydantic
- Structured JSON datasets
- Optional Ollama integration

---

# 12. Backend API

## Health

```http
GET /health
```

Checks whether the backend is running.

---

## Overview

```http
GET /api/overview
```

Returns high-level SEPHIQ platform and benchmark information.

---

## Signals

```http
GET /api/signals
```

Returns competitive intelligence signals.

---

## Companies

```http
GET /api/companies
```

Returns structured company profiles.

---

## Analysis

```http
POST /api/analyze
```

Runs the strategic analysis engine.

Example request:

```json
{
  "question": "Which company is moving fastest in AI?",
  "companies": [
    "Nexora",
    "Figma",
    "Canva",
    "Notion"
  ],
  "date_from": null,
  "date_to": null,
  "category": "AI",
  "analysis_type": "comparison"
}
```

---

# 13. Firebase Authentication

SEPHIQ supports Firebase Authentication for:

- User signup
- User login
- User logout
- Persistent authentication state

Firebase credentials are provided through:

```text
frontend/.env.local
```

They must never be committed to GitHub.

The application also supports a local authentication fallback when Firebase is not configured.

---

# 14. Firestore Saved Reports

Saved reports are stored using the following Firestore structure:

```text
users/
    {userId}/
        reports/
            {reportId}
```

Each report can contain:

- Title
- Strategic question
- Selected companies
- Category
- Strategic answer
- Key findings
- Common themes
- Differences
- Strategic recommendations
- Comparison scorecard
- Sources
- Timestamp

---

# 15. Firestore Security Rules

Recommended rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId}/reports/{reportId} {

      allow create: if request.auth != null
        && request.auth.uid == userId;

      allow read: if request.auth != null
        && request.auth.uid == userId;

      allow update: if request.auth != null
        && request.auth.uid == userId;

      allow delete: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

These rules ensure users can access only their own saved reports.

---

# 16. Local Mode

SEPHIQ can run without Firebase for local development.

When Firebase configuration is unavailable:

- Local authentication is used
- Local browser storage can maintain the session
- Reports can use local fallback storage

For production-style usage, Firebase should be configured.

---

# 17. Optional Ollama Integration

SEPHIQ includes optional local LLM support through Ollama.

Example environment configuration:

```env
SEPHIQ_USE_OLLAMA=true
OLLAMA_MODEL=llama3.2:3b
```

If Ollama is unavailable or disabled, SEPHIQ falls back to its deterministic analysis engine.

This ensures the application remains functional without requiring an external LLM.

---

# 18. Evidence Policy

SEPHIQ is designed around evidence-led analysis.

The analysis engine uses:

1. Structured Nexora benchmark data
2. Structured competitor profiles
3. Competitive signal history
4. User-selected companies
5. User-selected category
6. User-selected date range
7. User's strategic question

The system should not invent unsupported company facts.

Nexora data is synthetic and should be clearly distinguished from real competitor information.

---

# 19. Project Structure

```text
SEPHIQ/
│
├── backend/
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── engine.py
│   │   ├── llm.py
│   │   ├── main.py
│   │   ├── schemas.py
│   │   └── store.py
│   │
│   ├── data/
│   │   ├── change_history.json
│   │   ├── competitor_profiles.json
│   │   └── fictional_company.json
│   │
│   ├── tests/
│   │   └── test_engine.py
│   │
│   ├── pytest.ini
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   │
│   ├── public/
│   │   ├── logo.png
│   │   └── logo-dashboard.png
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── StatCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Compare.jsx
│   │   │   ├── Signals.jsx
│   │   │   ├── Analyst.jsx
│   │   │   └── Reports.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── AuthContext.jsx
│   │   ├── api.js
│   │   ├── firebase.js
│   │   ├── main.jsx
│   │   ├── reports.js
│   │   └── styles.css
│   │
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 20. Testing

## Backend Tests

From the backend directory:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pytest
```

The test suite covers the core API and analysis behavior.

---

## Frontend Production Build

From the frontend directory:

```powershell
cd frontend
npm run build
```

A successful build confirms that the React application can be compiled for production.

---

# 21. Manual API Verification

The backend can also be checked manually.

From PowerShell:

```powershell
curl http://127.0.0.1:8000/health
```

```powershell
curl http://127.0.0.1:8000/api/overview
```

```powershell
curl http://127.0.0.1:8000/api/signals
```

```powershell
curl http://127.0.0.1:8000/api/companies
```

All endpoints should return HTTP `200` when the backend is running correctly.

---

# 22. GitHub Setup

Before committing the project, verify that sensitive files are ignored.

Run:

```powershell
git status --short
```

The following should NOT appear:

```text
.env.local
frontend/.env.local
backend/.venv/
frontend/node_modules/
```

Initialize Git:

```powershell
git init
```

Set the main branch:

```powershell
git branch -M main
```

Add files:

```powershell
git add .
```

Check staged files:

```powershell
git status
```

Create the initial commit:

```powershell
git commit -m "Initial SEPHIQ competitive intelligence platform"
```

Connect GitHub:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/SEPHIQ.git
```

Verify:

```powershell
git remote -v
```

Push:

```powershell
git push -u origin main
```

---

# 23. Security Notes

Do not commit:

- Firebase API configuration intended to remain private
- `.env.local`
- Passwords
- Authentication credentials
- API keys
- Service-account JSON files
- Virtual environments
- `node_modules`
- Local build artifacts

Environment files are intentionally excluded through `.gitignore`.

Use `.env.example` to document required configuration without exposing secrets.

---

# 24. Development Workflow

A typical development workflow is:

```text
1. Start FastAPI backend
          ↓
2. Start React frontend
          ↓
3. Login / enter local workspace
          ↓
4. Select companies
          ↓
5. Select category
          ↓
6. Select date range
          ↓
7. Review generated question
          ↓
8. Modify question if required
          ↓
9. Run analysis
          ↓
10. Review evidence and recommendations
          ↓
11. Save strategic report
```

---

# 25. Strategic Use Case

SEPHIQ is designed to demonstrate how competitive intelligence can move beyond simple information collection.

Instead of only showing:

```text
Company → Update → Date
```

SEPHIQ connects:

```text
Signal
   ↓
Capability
   ↓
Competitive Difference
   ↓
Strategic Interpretation
   ↓
Recommended Action
```

This makes the platform useful for:

- Competitive intelligence
- Product strategy
- Market intelligence
- Strategic planning
- Product management
- Business analysis
- Management decision support

---

# 26. Technology Stack

## Frontend

- React
- Vite
- JavaScript
- Lucide React
- CSS

## Backend

- Python
- FastAPI
- Pydantic
- Pytest

## Data

- Structured JSON
- Synthetic Nexora benchmark dataset
- Competitive signal history
- Structured competitor profiles

## Authentication & Storage

- Firebase Authentication
- Cloud Firestore
- Local fallback storage

## Optional AI

- Ollama
- Local LLM inference

---

# 27. Project Status

SEPHIQ currently provides:

- [x] Authentication
- [x] Local authentication fallback
- [x] Firebase authentication support
- [x] Nexora benchmark
- [x] Figma competitor profile
- [x] Canva competitor profile
- [x] Notion competitor profile
- [x] Competitive signal history
- [x] Multi-company comparison
- [x] Category filtering
- [x] Date filtering
- [x] Automatic strategic questions
- [x] Custom strategic questions
- [x] Evidence-led analysis
- [x] Strategic recommendations
- [x] Comparison scorecard
- [x] Feature matrix
- [x] Saved reports
- [x] Firestore integration
- [x] Local report fallback
- [x] Optional Ollama support
- [x] Backend API
- [x] Backend tests
- [x] Production frontend build

---

# 28. Disclaimer

SEPHIQ is an academic/prototype Competitive Intelligence Platform.

Nexora is a fictional synthetic benchmark created for analytical and demonstration purposes.

Competitor information is structured for the purposes of the application and should not be treated as a substitute for comprehensive commercial due diligence or primary market research.

---

# SEPHIQ

### From Signals to Strategy

**Competitive intelligence → Evidence → Analysis → Strategic action**