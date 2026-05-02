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