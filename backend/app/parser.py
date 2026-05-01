from typing import TypedDict

class ParagraphChunk(TypedDict):
    series: str
    book: str
    chapter: int
    pov: str
    paragraph: int
    paragraph_text: str

def parse_book(content: str, book_title: str, series_title: str) -> list[ParagraphChunk]:
    chapters = content.split("")
    chunks: list[ParagraphChunk] = []

    for chapter_index, chapter_text in enumerate(chapters):
        chapter_text = chapter_text.strip()
        if not chapter_text:
            continue

        lines = chapter_text.split("\n", 1)
        pov = lines[0].strip()
        body = lines[1].strip() if len(lines) > 1 else ""

        if not body:
            continue

        paragraphs = [l.strip() for l in body.split("\n") if l.strip()]

        for para_index, para_text in enumerate(paragraphs):
            chunks.append({
                "series": series_title,
                "book": book_title,
                "chapter": chapter_index,
                "pov": pov,
                "paragraph": para_index + 1,
                "paragraph_text": para_text
            })

    return chunks