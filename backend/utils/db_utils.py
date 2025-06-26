import mysql.connector
from datetime import datetime

def log_attendance_mysql(name: str, method: str = "face"):
    now = datetime.now()
    date_str = now.date()
    time_str = now.time()

    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root@123",
            database="attendance_db"
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