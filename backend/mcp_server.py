# mcp_server.py
from mcp.server.fastmcp import FastMCP
import httpx
from app.types import ParagraphResult


mcp = FastMCP("series-bible")
    
async def query_similar(query: str, limit: int = 5) -> list[ParagraphResult]:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/search",
            json={"query": query, "limit": limit}
        )
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def search_series(query: str, limit: int = 5) -> str:
    """Search the series bible for relevant passages"""
    results = await query_similar(query, limit)
    formatted: list[str] = []
    for i, r in enumerate(results, 1):
        formatted.append(
            f"[Result {i}]\n"
            f"Book: {r['book']}\n"
            f"Chapter: {r['chapter']}\n"
            f"POV: {r['pov']}\n"
            f"Passage:\n{r['paragraph_text']}"
        )
    return "\n\n---\n\n".join(formatted)

if __name__ == "__main__":
    mcp.run()