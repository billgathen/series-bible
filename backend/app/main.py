from fastapi import Depends, FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import OperationalError
from app.database import get_db, embed_and_store, query_library, query_similar, delete_book, delete_series
from app.parser import parse_book
from app.types import LibraryResult, ParagraphResult, SearchRequest


app = FastAPI()

origins = [
  "http://localhost:5173",
  "localhost:5173"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

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
    series_title: str = Form("unknown"),
    book_title: str = Form("unknown"),
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

@app.get('/library', tags=["query"])
async def library(db: AsyncSession = Depends(get_db)) -> list[LibraryResult]:
   return await query_library(db)

@app.delete('/library/{series}', tags=["load"])
async def remove_series(series: str, db: AsyncSession = Depends(get_db)):
    count = await delete_series(series, db)
    return {"deleted": count}

@app.delete('/library/{series}/{book}', tags=["load"])
async def remove_book(series: str, book: str, db: AsyncSession = Depends(get_db)):
    count = await delete_book(series, book, db)
    return {"deleted": count}

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse("frontend/dist/index.html")