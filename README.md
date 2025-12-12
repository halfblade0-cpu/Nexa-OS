

What you'll find:
- `index.html` — main demo page (desktop, dock, start menu, windows).
- `styles.css` — styling for the night-sky theme, mountains, dock, and windows.
- `script.js` — interactivity: stars generation, clock, draggable windows, terminal mock, and in-app browser controls.
- `server.js` — small Express server that serves the demo (port 3000) and an example target site (port 8080).
- `package.json` — Node script to run the servers.

How to run locally:
1. Install Node.js (>=14) and npm.
2. From the repository root run:

```bash
npm install
npm start
```

3. Open the demo in your browser at: http://localhost:3000
4. Use the Desktop -> Browser app (or click the Browser dock icon). By default it loads http://localhost:8080 (an example site the server starts for you). You can enter other addresses in the address bar.

Notes:
- The in-app browser uses an iframe; it will obey the target site's embedding policies (X-Frame-Options, Content-Security-Policy). Some external sites may refuse to be loaded inside an iframe.
- The included target on port 8080 is a tiny example so you can test the browser functionality locally.

Enjoy experimenting with nexaOS!
