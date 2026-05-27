# series-bible 📚

Convert fiction book text into AI-digestible data, allowing on-demand queries of the content to maintain continuity throughout a series.

I built this tool to help me stay on track as I continue work on my fiction series [Rise of the Shapers](https://www.amazon.com/dp/B0GPX7PNSP), so the examples refer to those books and characters. Check it out if you're interested! If not, I still hope this helps you in your own writing projects.

## Tech Stack/Architecture

`series-bible` uses a RAG (Retrieval-Augmented Generation) approach: raw text files are chunked, embedded, and stored in a vector database paragraph-by-paragraph. An MCP server exposes a search tool that performs semantic similarity queries against those embeddings, adding the results to the current prompt for enhanced context. Storing the embeddings at the paragraph level allows fine-grained results which improves output and radically-reduces token usage compared to loading the entire document with every session.

It's built with React, Python, FastAPI, Docker, Alembic, SQLAlchemy, and pgvector on top of a locally-hosted Postgres database. I include an example for integrating with Claude Desktop, but it should work with any desktop client that supports MCP, which should be all of them.

## Setup

Clone the app into a local folder. Make sure you have [Docker](https://docs.docker.com/get-started/introduction/develop-with-containers/) installed and running on your system.

From the terminal in the project folder, run `docker compose up --build` On future runs, `docker compose up` will be **much** faster, but for now, go grab a beverage and spend some quality time on Reddit.

When it finally says `Application startup complete`, your server should be up and running at http://localhost:8000.

## Loading your series

Information about the app and instructions for getting started are on the [home](http://localhost:8000) page. The [docs](http://localhost:8000/docs) page is also fully-functional if you'd prefer to use that, but it's mostly legacy at this point.

**NOTE** I write in [Scrivener](https://www.literatureandlatte.com/scrivener/overview) and when it exports to text, it splits the chapters using a "section delimiter" character you can find in `app.parser:parse_book`. If your files don't have these dividers, it will treat the whole book as one chapter. Most things will still work, but you won't be able to ask chapter-specific questions. Also, I name my chapters after the POV character, so if you name them something else, or don't name them at all, you may get odd results.

## Possible Future Enhancements

**DONE** The UX using the FastAPI docs page is overly-utilitarian, and could use a dedicated page to replicate the logic. In the interest of speed-to-market (so I could start using it) I backburnered that work for now, especially since the audience is developer/authors like myself who will be familiar with the interface. Also, uploading books is a one-time action and all subsequent interaction is through the desktop AI client.

**DONE** The MCP interface doesn't surface data on which series/book/chapter the results come from, which would definitely improve usability. Asking "what color is Bix's hair" might result in multiple conflicting results and allow the client to say "in chapter 3, paragraph 5 of Elements of Betrayal you say it's red, but in chapter 7, paragraph 14 of Weapons of Starlight you call it auburn."

Being able to see what is loaded and easily edit/remove books would be handy. Build full CRUD interface.

Using the contents of the database to generate suggested prompts on the "Connect Your AI" page would be helpful.
