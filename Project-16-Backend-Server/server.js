// ---- PROJECT 16: FIRST BACKEND SERVER ----
// This file runs on your computer, not in the browser

const express = require("express");
const app     = express();
const PORT    = 3000;

// Middleware - allows server to read JSON from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- ROUTES ----

// Route 1 - Home page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>My First Server</title>
        <style>
          body { font-family: Arial; background: #0a0a1a; color: white; 
                 display: flex; align-items: center; justify-content: center; 
                 min-height: 100vh; margin: 0; }
          .container { text-align: center; padding: 40px; }
          h1 { color: #667eea; font-size: 2.5em; }
          p  { color: #aaa; margin: 10px 0; }
          a  { color: #667eea; text-decoration: none; display: block; 
               margin: 8px 0; font-size: 1.1em; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 My First Backend Server</h1>
          <p>Server is running on port ${PORT}</p>
          <p>Try these routes:</p>
          <a href="/about">/about</a>
          <a href="/api/projects">/api/projects</a>
          <a href="/api/time">/api/time</a>
          <a href="/api/weather">/api/weather</a>
        </div>
      </body>
    </html>
  `);
});

// Route 2 - About page
app.get("/about", (req, res) => {
  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>About</title>
        <style>
          body { font-family: Arial; background: #0a0a1a; color: white;
                 display: flex; align-items: center; justify-content: center;
                 min-height: 100vh; margin: 0; }
          .container { text-align: center; padding: 40px; }
          h1 { color: #00ff88; }
          a  { color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>About This Server</h1>
          <p>Built with Node.js and Express</p>
          <p>This is Project 16 of my coding journey</p>
          <a href="/">← Back Home</a>
        </div>
      </body>
    </html>
  `);
});

// Route 3 - API returning JSON data
app.get("/api/projects", (req, res) => {
  const projects = [
    { id: 1,  name: "Hello World",        tech: ["HTML"] },
    { id: 2,  name: "Bio Page",           tech: ["HTML", "CSS"] },
    { id: 3,  name: "Recipe Page",        tech: ["HTML", "CSS"] },
    { id: 4,  name: "Mini Website",       tech: ["HTML", "CSS"] },
    { id: 5,  name: "Google Clone",       tech: ["HTML", "CSS"] },
    { id: 6,  name: "Click Counter",      tech: ["HTML", "CSS", "JS"] },
    { id: 7,  name: "To-Do List",         tech: ["HTML", "CSS", "JS"] },
    { id: 8,  name: "Calculator",         tech: ["HTML", "CSS", "JS"] },
    { id: 9,  name: "Quiz App",           tech: ["HTML", "CSS", "JS"] },
    { id: 10, name: "Weather App",        tech: ["HTML", "CSS", "JS", "API"] },
    { id: 11, name: "Soccer App",         tech: ["HTML", "CSS", "JS", "API"] },
    { id: 12, name: "Portfolio",          tech: ["HTML", "CSS", "JS"] },
    { id: 13, name: "Wander Landing",     tech: ["HTML", "CSS", "JS"] },
    { id: 14, name: "Djembe Music Page",  tech: ["HTML", "CSS", "JS"] },
    { id: 15, name: "On Field Sports",    tech: ["HTML", "CSS", "JS", "API"] },
    { id: 16, name: "Backend Server",     tech: ["Node.js", "Express"] }
  ];

  res.json({
    success: true,
    total: projects.length,
    projects: projects
  });
});

// Route 4 - Current server time
app.get("/api/time", (req, res) => {
  const now = new Date();
  res.json({
    success:   true,
    timestamp: now.toISOString(),
    date:      now.toDateString(),
    time:      now.toLocaleTimeString(),
    timezone:  Intl.DateTimeFormat().resolvedOptions().timeZone
  });
});

// Route 5 - Mock weather data
app.get("/api/weather", (req, res) => {
  res.json({
    success:  true,
    city:     "Montreal",
    temp:     "-2°C",
    feels:    "-8°C",
    condition: "Snowy",
    humidity: "78%",
    wind:     "15 km/h",
    message:  "This is mock data — connect a real API for live weather"
  });
});

// Route 6 - Handle POST request (form submission)
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error:   "Please provide name, email and message"
    });
  }

  console.log(`New contact from: ${name} (${email})`);
  console.log(`Message: ${message}`);

  res.json({
    success: true,
    message: `Thanks ${name}! Your message was received.`
  });
});

// Route 7 - Handle unknown routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error:   "Route not found",
    path:    req.path
  });
});

// ---- START THE SERVER ----
app.listen(PORT, () => {
  console.log(`
  ✅ Server is running!
  🌐 Open: http://localhost:${PORT}
  📡 API:  http://localhost:${PORT}/api/projects
  ⏰ Time: http://localhost:${PORT}/api/time
  🌤️  Weather: http://localhost:${PORT}/api/weather
  `);
});