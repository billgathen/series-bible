from fastapi import Depends, FastAPI, UploadFile, File
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import OperationalError
from app.database import get_db, embed_and_store, query_similar
from app.parser import parse_book
from app.types import ParagraphResult, SearchRequest


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

@app.post('/parse_text_file', tags=["load"])
async def parse_text_file(
    file: UploadFile = File(...),
    series_title: str = "unknown",
    book_title: str = "unknown",
    db: AsyncSession = Depends(get_db)
):
    content = await file.read()
    text_content = content.decode("utf-8")
    chunks = parse_book(text_content, book_title, series_title)
    count = await embed_and_store(chunks, db)
    return { "chunks stored": count }

@app.post('/search', tags=["query"])
async def search(request: SearchRequest, db: AsyncSession = Depends(get_db)) -> list[ParagraphResult]:
  results = await query_similar(request.query, request.limit, db)
  return [
    {
      "book": r.book,
      "chapter": r.chapter,
      "pov": r.pov,
      "paragraph_text": r.paragraph_text
    }
    for r in results
  ]