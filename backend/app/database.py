from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select, func
from app.types import LibraryResult
from sentence_transformers import SentenceTransformer # type: ignore
from app.models import Paragraph
from app.parser import ParagraphChunk
import os

db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise RuntimeError("DATABASE_URL is not set")

engine = create_async_engine(db_url)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

model = SentenceTransformer("all-MiniLM-L6-v2") # type: ignore

async def get_db():
    async with SessionLocal() as session:
        yield session

async def embed_and_store(chunks: list[ParagraphChunk], db: AsyncSession) -> int:
    texts = [c["paragraph_text"] for c in chunks]
    vectors = model.encode(texts) # type: ignore

    rows = [
        Paragraph(
            series=c["series"],
            book=c["book"],
            chapter=c["chapter"],
            pov=c["pov"],
            paragraph=c["paragraph"],
            paragraph_text=c["paragraph_text"],
            embedding=vec.tolist(), # type: ignore
        )
        for c, vec in zip(chunks, vectors) # type: ignore
    ]

    db.add_all(rows)
    await db.commit()
    return len(rows)

async def query_similar(query: str, limit: int, db: AsyncSession) -> list[Paragraph]:
    vec = model.encode([query])[0].tolist()  # type: ignore
    result = await db.execute(
        select(Paragraph)
        .order_by(Paragraph.embedding.op("<=>")(vec))
        .limit(limit)
    )
    return list(result.scalars().all())

async def delete_book(series: str, book: str, db: AsyncSession) -> int:
    from sqlalchemy import delete
    result = await db.execute(
        delete(Paragraph).where(Paragraph.series == series, Paragraph.book == book)
    )
    await db.commit()
    return result.rowcount

async def delete_series(series: str, db: AsyncSession) -> int:
    from sqlalchemy import delete
    result = await db.execute(
        delete(Paragraph).where(Paragraph.series == series)
    )
    await db.commit()
    return result.rowcount

async def query_library(db: AsyncSession) -> list[LibraryResult]:
    result = await db.execute(
        select(
            Paragraph.series,
            Paragraph.book,
            func.count(Paragraph.chapter.distinct()).label("chapter_ct"),
            func.count(Paragraph.paragraph).label("paragraph_ct")
        )
        .group_by(Paragraph.series, Paragraph.book)
        .order_by(Paragraph.series)
    )
    return [LibraryResult(**row) for row in result.mappings().all()]