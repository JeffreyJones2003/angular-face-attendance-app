# 👤 Face Attendance System

Secure and modern attendance system using **Face Recognition** and **Fingerprint (Touch ID)** with **Angular + FastAPI + MySQL**.

🔗 **Live Demo**: [https://angular-attendance-app.netlify.app/login](https://angular-attendance-app.netlify.app/login)

## 🔧 Tech Stack
- Angular 17 (Frontend)
- FastAPI + Python (Backend)
- MySQL (Database)
- Face Recognition Library (dlib)
- WebAuthn API (Fingerprint auth)

## 🚀 Features
- ✅ Face recognition via webcam or file upload
- ✅ Fingerprint login (Touch ID/WebAuthn)
- ✅ Admin login with JWT
- ✅ Attendance logs stored in MySQL
- ✅ Responsive UI (Bootstrap)

---

## 🔧 Local Development Setup

### Prerequisites:
- Node.js + Angular CLI
- Python 3.10+
- MySQL running locally (or Railway hosted)

### 1️⃣ Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

## 💻 Frontend (Angular 17)

```bash
cd frontend
npm install
ng serve

📌 Author

Jeffrey Jones S — https://github.com/JeffreyJones2003

📌 License

This project is open source and available under the MIT License.
