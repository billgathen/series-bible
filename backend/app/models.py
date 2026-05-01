from pgvector.sqlalchemy import Vector # type: ignore
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from sqlalchemy import String, Integer, Text, Index

class Base(DeclarativeBase):
    pass

class Paragraph(Base):
    __tablename__ = "paragraphs"

    id:              Mapped[int]   = mapped_column(primary_key=True)
    series:          Mapped[str]   = mapped_column(String)
    book:            Mapped[str]   = mapped_column(String)
    chapter:         Mapped[int]   = mapped_column(Integer)
    pov:             Mapped[str]   = mapped_column(String)
    paragraph:       Mapped[int]   = mapped_column(Integer)
    full_paragraph:  Mapped[str]   = mapped_column(Text)
    sentences:       Mapped[str]   = mapped_column(Text)  # JSON string
    embedding:       Mapped[list[float]]  = mapped_column(Vector(384))  # all-MiniLM-L6-v2 dims

    __table_args__ = (
        Index("ix_paragraphs_embedding", "embedding", postgresql_using="ivfflat"),
    )