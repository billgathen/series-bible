from fastapi import Depends, FastAPI, UploadFile, File
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from app.database import get_db
from app.parser import parse_book

app = FastAPI()

@app.get('/health', tags=["health"])
def get_health():
  return { 'status': 'ok'}

@app.get('/dbhealth', tags=["health"])
async def db_health(db: Session = Depends(get_db)):
  try:
    db.execute(text("SELECT 1"))
    return { "db status": "ok"}
  except OperationalError:
    return { "error": "Database is unavailable"}

@app.post('/parse_text_file', tags=["loading"])
async def parse_text_file(
    file: UploadFile = File(...),
    series_title: str = "unknown",
    book_title: str = "unknown",
):
    content = await file.read()
    text_content = content.decode("utf-8")
    chunks = parse_book(text_content, book_title, series_title)
    return chunks