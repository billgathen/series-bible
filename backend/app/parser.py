import re
from typing import TypedDict
import nltk # type: ignore
nltk.download("punkt_tab") # type: ignore

class SentenceChunk(TypedDict):
    series: str
    book: str
    chapter: int
    pov: str
    paragraph: int
    full_paragraph: str
    sentences: list[str]

def split_sentences(text: str) -> list[str]:
    result: list[str] = nltk.sent_tokenize(text) # type: ignore[no-untyped-call]
    return result

def parse_book(filepath: str, book_title: str, series_title: str) -> list[SentenceChunk]:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    chapters = content.split("§")
    chunks: list[SentenceChunk] = []

    for chapter_index, chapter_text in enumerate(chapters):
        chapter_text = chapter_text.strip()
        if not chapter_text:
            continue

        lines = chapter_text.split("\n", 1)
        pov = lines[0].strip()
        body = lines[1].strip() if len(lines) > 1 else ""

        if not body:
            continue

        # Merge single newlines (dialogue) into surrounding prose
        normalized = re.sub(r"\n(?!\n)", " ", body)
        paragraphs = [p.strip() for p in normalized.split("\n\n") if p.strip()]

        for para_index, para_text in enumerate(paragraphs):
            chunks.append({
                "series": series_title,
                "book": book_title,
                "chapter": chapter_index + 1,
                "pov": pov,
                "paragraph": para_index,
                "full_paragraph": para_text,
                "sentences": split_sentences(para_text),
            })

    return chunks