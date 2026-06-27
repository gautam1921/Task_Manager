# Task Manager

A full-stack, responsive Task Management application featuring a modern "Zoneless" Angular 22 frontend and a lightning-fast Python FastAPI backend. 

## 🚀 Tech Stack

### Frontend
* **Framework:** Angular 22 (Standalone Components, Zoneless Architecture)
* **Reactivity:** Angular Signals (`signal`, `computed`)
* **Styling:** Tailwind CSS (Utility-first styling)
* **Testing:** Vanilla TypeScript Mocks (Vitest/Jest)

### Backend
* **Framework:** FastAPI (Python)
* **Database:** SQLite (via SQLAlchemy ORM)
* **Server:** Uvicorn

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine:
* **Node.js** (v18 or higher) & npm
* **Python** (v3.9 or higher)
* Git

---

## 🛠️ Local Development Setup

### 1. Backend Setup (FastAPI)

Navigate to the backend directory and set up your Python environment:

bash
# Navigate to the backend folder
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install the dependencies
pip install -r requirements.txt

Environment Variables (Backend)
Create a .env file in the root of the backend directory and add the following configuration:

Code snippet
DATABASE_URL=sqlite:///./tasks.db
FRONTEND_CORS_URL=http://localhost:4200
Start the Backend Server
Bash
uvicorn main:app --reload
The API will be available at http://127.0.0.1:8000
Interactive API documentation (Swagger UI) is available at http://127.0.0.1:8000/docs

2. Frontend Setup (Angular 22)
Open a new terminal window, navigate to the frontend directory, and start the Angular development server:

Bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
The application will automatically open in your browser at http://localhost:4200

🧪 Testing
The frontend utilizes a Self-Contained Isolation Pattern with Vanilla TypeScript Mocks to ensure lightning-fast, race-condition-free unit tests.

To run the test suite:

Bash
cd frontend
npm test
