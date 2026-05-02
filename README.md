# series-bible

Convert book text into AI-digestible data, allowing on-demand queries of the content.

## Setup

Clone the app into a local folder. Make sure you have [Docker](https://docs.docker.com/get-started/introduction/develop-with-containers/) installed and running on your system.

From the terminal in the project folder, run `docker compose up --build` On future runs, `docker compose up` will be **much** faster, but for now, go grab a beverage and spend some quality time on Reddit.

When it finally says `Application startup complete`, your server should be up and running on localhost. Check http://localhost:8000/docs for current API endpoints.

## Loading your series

Open the [docs](http://localhost:8000/docs) page.

In the **load** section, open the `parse_text_file` endpoint.

Click "Try it out" and fill in `series_title` and `book_title`.

Use the `file` picker to point to your exported text file.

**NOTE** I write in [Scrivener](https://www.literatureandlatte.com/scrivener/overview) and when it exports to text, it splits the chapters using a "section delimiter" character you can find in `app.parser:parse_book`. If your files don't have these dividers, it will treat the whole book as one chapter. Most things will still work, but you won't be able to ask chapter-specific questions. Also, I name my chapters after the POV character, so if you name them something else, you may get odd results if you ask about POV.

Click `Execute`. The loader will spin for a bit, then it should show `200 Successful Response` and tell you how many chunks it added to the system.

Repeat this for the remaining books in the series.

## Configuring Claude Desktop

The `MCP` server inside series-bible should work with any AI client, but here are the instructions for wiring it up to [Claude Desktop](https://claude.com/download). I am on the free plan, and it works just fine!

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

Change `/path/to/your/project` to the actual path to your project, then save the file.

Close Claude Desktop if it's open, then re-open it.

If anything is wrong, you'll get an error in the upper-right corner saying so. You can view the logs and try to debug the situation if you're feeling confident ;-).

If no error appears, open the sidebar and click on `Projects`.

Create a new project named after your series.

Toward the bottom of the main project page, you'll see `Instructions`. Click on the pencil icon to edit it.

Copy/paste the following in the textbox:

```
You are the curator of the series bible for my novel series "The Best Series Ever". Use the series-bible tool to find the answers you need. Do not use any other sources of information. Do not make anything up.

The books follow this order:
1) Book of the First
2) Book of the Second
3) Bob Chickens Out
```

Edit the names to match your series, then click "Save Instructions".

In the chat textbox, try asking "Describe <your main character>"

It will likely take a few seconds, but you should get some good results. From there, the sky's the limit. Enjoy!
