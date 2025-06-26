from fastapi import FastAPI, UploadFile, File ,Body
from fastapi import Request
from fastapi import HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from utils.face_utils import recognize_face, encode_known_faces
from utils.auth_utils import authenticate_user, create_access_token
from datetime import datetime, timedelta
from utils.db_utils import log_attendance_mysql
from fastapi.responses import JSONResponse
import mysql.connector
import traceback
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str

@app.on_event("startup")
def startup_event():
    if not os.path.exists("models/known_faces.pkl"):
        encode_known_faces()

@app.post("/login/")
def login(login_req: LoginRequest):
    user = authenticate_user(login_req.username, login_req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user['username']})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/recognize-face/")
async def recognize_face_api(file: UploadFile = File(...)):
    temp_filename = f"temp_{uuid.uuid4().hex}.jpg"
    
    with open(temp_filename, "wb") as f:
        f.write(await file.read())

    result = recognize_face(temp_filename)
    os.remove(temp_filename)

    # ✅ Log attendance only if recognized
    if result:
        log_attendance_mysql(result, method="face")

    return {"name": result if result else "Unknown"}

@app.post("/verify-fingerprint/")
async def verify_fingerprint(request: Request):
    try:
        data = await request.json()
        name = data.get("name", "Unknown")

        # ✅ Log attendance if name is recognized
        if name and name != "Unknown":
            log_attendance_mysql(name, method="fingerprint")
            return {"message": f"Fingerprint verified and attendance logged for {name}"}
        else:
            return JSONResponse(content={"error": "Invalid name for fingerprint logging"}, status_code=400)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    


@app.get("/attendance-logs/")
def get_attendance_logs():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root@123",   # replace as needed
            database="attendance_db"
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM attendance ORDER BY date DESC, time DESC")
        records = cursor.fetchall()
        cursor.close()
        conn.close()

        # ✅ Convert date and time to strings
        for row in records:
            # Convert `date` to YYYY-MM-DD
            if isinstance(row.get("date"), datetime):
                row["date"] = row["date"].strftime("%Y-%m-%d")
            elif hasattr(row.get("date"), "isoformat"):
                row["date"] = row["date"].isoformat()

            # Convert `time` to HH:MM:SS
            if isinstance(row.get("time"), timedelta):
                row["time"] = (datetime.min + row["time"]).time().strftime("%H:%M:%S")
            elif hasattr(row.get("time"), "strftime"):
                row["time"] = row["time"].strftime("%H:%M:%S")

        return JSONResponse(content=records)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
@app.get("/")
def read_root():
    return {"message": "Backend API is running"}

print(traceback.format_exc())
print("✅ /attendance-logs/ endpoint hit")