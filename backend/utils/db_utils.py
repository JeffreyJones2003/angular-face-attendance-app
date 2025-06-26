import mysql.connector
from datetime import datetime
import os  # 👈 for environment variables

def log_attendance_mysql(name: str, method: str = "face"):
    now = datetime.now()
    date_str = now.date()
    time_str = now.time()

    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT", 3306)),  # default MySQL port
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        cursor = conn.cursor()
        sql = "INSERT INTO attendance (name, method, date, time) VALUES (%s, %s, %s, %s)"
        values = (name, method, date_str, time_str)

        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Attendance logged to MySQL")
    except Exception as e:
        print("❌ Error logging to MySQL:", e)
