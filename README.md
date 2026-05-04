# series-bible 📚

Convert fiction book text into AI-digestible data, allowing on-demand queries of the content to maintain continuity throughout a series.

I built this tool to help me stay on track as I continue work on my fiction series [Rise of the Shapers](https://www.amazon.com/dp/B0GPX7PNSP), so the examples refer to those books and characters. Check it out if you're interested! If not, I still hope this helps you in your own writing projects.

## Tech Stack/Architecture

`series-bible` uses a RAG (Retrieval-Augmented Generation) approach: raw text files are chunked, embedded, and stored in a vector database paragraph-by-paragraph. An MCP server exposes a search tool that performs semantic similarity queries against those embeddings, adding the results to the current prompt for enhanced context. Storing the embeddings at the paragraph level allows fine-grained results which improves output and radically-reduces token usage compared to loading the entire document with every session.

It's built with Python, FastAPI, Docker, Alembic, SQLAlchemy, and pgvector on top of a locally-hosted Postgres database. I include an example for integrating with Claude Desktop, but it should work with any desktop client that supports MCP, which should be all of them.

## Setup

Clone the app into a local folder. Make sure you have [Docker](https://docs.docker.com/get-started/introduction/develop-with-containers/) installed and running on your system.

From the terminal in the project folder, run `docker compose up --build` On future runs, `docker compose up` will be **much** faster, but for now, go grab a beverage and spend some quality time on Reddit.

When it finally says `Application startup complete`, your server should be up and running on localhost. Check http://localhost:8000/docs for current API endpoints.

## Loading your series

Open the [docs](http://localhost:8000/docs) page.

In the **load** section, open the `parse_text_file` endpoint.

Click "Try it out" and fill in `series_title` and `book_title`.

Use the `file` picker to point to your exported text file.

**NOTE** I write in [Scrivener](https://www.literatureandlatte.com/scrivener/overview) and when it exports to text, it splits the chapters using a "section delimiter" character you can find in `app.parser:parse_book`. If your files don't have these dividers, it will treat the whole book as one chapter. Most things will still work, but you won't be able to ask chapter-specific questions. Also, I name my chapters after the POV character, so if you name them something else, or don't name them at all, you may get odd results.

Click `Execute`. The loader will spin for a bit, then it should show `200 Successful Response` and tell you how many chunks it added to the system.

Repeat this for the remaining books in the series.

## Configuring Claude Desktop

The `MCP` server inside series-bible should work with any desktop AI client, but here are the instructions for wiring it up to [Claude Desktop](https://claude.com/download). I am on the free plan, and it works just fine!

Open `settings` and click the `Developer` option in the sidebar, all the way at the bottom.

On the right where it says "Local MCP servers", click the `Edit Config` button. It should point you to a file called `claude_desktop_config.json`. Edit it in your favorite text editor.

Most-likely it will be empty, in which case you can copy/paste the following code in as-is.

```
{
  "mcpServers": {
    "series-bible": {
      "command": "/path/to/your/project/backend/.venv/bin/python",
      "args": ["/path/to/your/project/backend/mcp_server.py"]
    }
  }
}
```

If the isn't empty when you open it, insert just the "mcpServers" block next to whatever content is already there.

Change `/path/to/your/project` to the actual path to your project, then save the file.

Close Claude Desktop if it's open, then re-open it.

If anything is wrong, you'll get an error in the upper-right corner saying so. You can view the logs and try to debug the situation if you're feeling confident ;-).

If no error appears, open the sidebar and click on `Projects`.

Create a new project named after your series. I called mine `Rise of the Shapers`.

Toward the bottom of the main project page, you'll see `Instructions`. Click on the pencil icon to edit it.

Copy/paste the following in the textbox:

```
You are the curator of the series bible for my novel series "Rise of the Shapers". Use the series-bible tool to find the answers you need. Do not use any other sources of information. Do not make anything up.

The books follow this order:
1) Elements of Betrayal
1.5) No Good Deed
2) Rules of Abduction
3) Weapons of Starlight
```

Edit the names to match your series, then click "Save Instructions".

In the chat textbox, try asking "Describe Abby, Doug, Finn, Bix, and Thea" (or whatever your lead character names are)

It will likely take a few seconds, but you should get good results. From there, the sky's the limit. You can ask about locations, specific events, etc. Get creative with it and be sure to enjoy!

## Possible Future Enhancements

The UX using the FastAPI docs page is overly-utilitarian, and could use a dedicated page to replicate the logic. In the interest of speed-to-market (so I could start using it) I backburnered that work for now, especially since the audience is developer/authors like myself who will be familiar with the interface. Also, uploading books is a one-time action and all subsequent interaction is through the desktop AI client.

The MCP interface doesn't surface data on which series/book/chapter the results come from, which would definitely improve usability. Asking "what color is Bix's hair" might result in multiple conflicting results and allow the client to say "in chapter 3, paragraph 5 of Elements of Betrayal you say it's red, but in chapter 7, paragraph 14 of Weapons of Starlight you call it auburn."

The ability to support multiple series would be useful, as well, at least for writers with a larger back-catalog than mine. ;-) The series name is included in the data, but the semantic similarity query doesn't actively-use it. Setting up a separate project and adding "All questions will refer to the Rise of the Shapers series: ignore results from any other series." would be powerful for authors working on multiple series in parallel.
