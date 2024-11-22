from database import engine  # นำเข้า engine จากไฟล์ database.py
from sqlalchemy import inspect

def check_connection():
    try:
        # ตรวจสอบการเชื่อมต่อโดยใช้ inspect เพื่อดูว่าเราสามารถเชื่อมต่อกับฐานข้อมูลได้หรือไม่
        inspector = inspect(engine)
        tables = inspector.get_table_names()  # ดึงชื่อของตารางในฐานข้อมูล
        print("Connected to the database. Tables available:", tables)
    except Exception as e:
        print("Error connecting to the database:", str(e))


if __name__ == '__main__':
    check_connection()
