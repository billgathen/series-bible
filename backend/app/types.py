from typing import TypedDict
from pydantic import BaseModel

class SearchRequest(BaseModel):
  query: str
  limit: int = 5

class ParagraphResult(TypedDict):
    book: str
    chapter: int
    pov: str
    paragraph_text: str

class LibraryResult(TypedDict):
   series: str
   book: str
   chapter_ct: int
   paragraph_ct: int