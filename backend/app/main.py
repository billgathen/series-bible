from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from app.database import get_db

app = FastAPI()

@app.get('/health')
def get_health():
  return { 'status': 'ok'}

@app.get('/dbhealth')
async def db_health(db: Session = Depends(get_db)):
  try:
    db.execute(text("SELECT 1"))
    return { "db status": "ok"}
  except OperationalError:
    return { "error": "Database is unavailable"}