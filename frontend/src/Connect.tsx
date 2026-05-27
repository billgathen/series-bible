export default function Connect() {
  return (
    <>
      <h2>Connect Your AI</h2>
      <p>
        These instructions are for connecting <a href="https://code.claude.com/docs/en/desktop-quickstart">Claude Desktop</a>. The process should be similar for <a href="https://chatgpt.com/features/desktop/">ChatGPT Desktop</a> or other AI clients. A free usage plan should be fine for regular use.
      </p>
      <ol>
        <li>
          Open <code>settings</code> and click the <code>Developer</code> option in the sidebar, all the way at the bottom.
        </li>
        <li>On the right where it says "Local MCP servers", click the <code>Edit Config</code> button. It should point you to a file called <code>claude_desktop_config.json</code>. Edit it in your favorite text editor.</li>

        <li>Most-likely it will be empty, in which case you can copy/paste the following code in as-is.
          <pre>
            <code>
              {`{
  "mcpServers": {
    "series-bible": {
      "command": "/path/to/your/project/backend/.venv/bin/python",
      "args": ["/path/to/your/project/backend/mcp_server.py"]
    }
  }
}`}
            </code>
          </pre>
        </li>

        <li>If the file isn't empty when you open it, insert just the "mcpServers" block next to whatever content is already there.</li>

        <li>Change <code>/path/to/your/project</code> to the actual path to your project, then save the file.</li>

        <li>Close Claude Desktop if it's open, then re-open it.</li>

        <li>If anything is wrong, you'll get an error in the upper-right corner saying so. You can view the logs and try to debug the situation if you're feeling confident 😉.</li>

        <li>If no error appears, open the sidebar and click on <code>Projects</code>.</li>

        <li>Create a new project named after your series. I called mine "Rise of the Shapers".</li>

        <li>Toward the bottom of the main project page, you'll see <code>Instructions</code>. Click on the pencil icon to edit it.</li>

        <li>
          Copy/paste the following in the textbox:
          <pre>
            <code>
              {`You are the curator of the series bible for my novel series "Rise of the Shapers".
Use the series-bible tool to find the answers you need.
Do not use any other sources of information. Do not make anything up.

The books follow this order:
1) Elements of Betrayal
1.5) No Good Deed
2) Rules of Abduction
3) Weapons of Starlight`}
            </code>
          </pre>
        </li>

        <li>Edit the names to match your series details, then click <code>Save Instructions</code>.</li>

        <li>In the chat textbox, try asking "Describe Abby, Doug, Finn, Bix, and Thea" (or whatever your lead character names are)</li>

        <li>It will likely take a few seconds, but you should get good results. From there, the sky's the limit. You can ask about locations, specific events, etc. Get creative with it and be sure to enjoy!</li>
      </ol>

    </>
  )
}