from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os

db_url = os.getenv("DATABASE_URL")
if not db_url:
  raise RuntimeError("DATABASE_URL is not set")

engine = create_async_engine(db_url)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
  async with SessionLocal() as session:
    yield session
