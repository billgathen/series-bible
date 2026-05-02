from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
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